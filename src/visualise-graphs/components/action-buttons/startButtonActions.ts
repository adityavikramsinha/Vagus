import useGraphStore, {NodeType} from "@/stores/GraphStore";
import Pipe from "@graph/api/Pipe";
import Syncer from "@graph/api/Syncer";
import AlgorithmRunner from "../../api/AlgorithmRunner";
import {AlgoType, NOTSET, NOTSET_t} from "@graph/ts/Types";
import {match, P} from "ts-pattern";
import BackendStateManager from "@graph/api/BackendStateManager";
import Animator from "@graph/api/Animator";
import {Exception, StartButtonError} from "@/components/action-buttons/StartButton";
import biDirectional from "../../../algorithms/bi_directional";

/**
 * Main runner for the algorithm. It assumes nothing, hence it will BLOCK and set EXECUTING (defined in the
 * FrontendStateManager) and then UNBLOCK and unset EXECUTING.
 *
 * Based on whether the Bomb Node is set or not, it will decide which type of environment to run the
 * algorithm in.
 *
 * @param type Type of Algorithm to run
 * @param startNodeId
 * @param endNodeId
 * @param bombNodeId
 */
const runAlgorithmAnimation = async (
    type: AlgoType, {startNodeId, endNodeId, bombNodeId}: {
        startNodeId: string,
        endNodeId: string,
        bombNodeId: string | NOTSET_t
    }) => {
    // BLOCK all operations, (this blocks the three buttons)
    useGraphStore.setState({block: true});
    // Notify the Syncer to be ready to sync state via running blocks of code
    // that watch for the 'executing' state.
    useGraphStore.setState({executing: true});
    if (bombNodeId === NOTSET) {
        const {path, visited} = AlgorithmRunner.runWithoutBombNode(
            type,
            startNodeId,
            endNodeId
        );
        await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
        await Animator.animatePathNodes(path);

        // free resource
        useGraphStore.setState({block: false});
        useGraphStore.setState({executing: false});
    } else {
        const {path, visitedP1, visitedP2} = AlgorithmRunner.runWithBombNode(
            type,
            startNodeId,
            endNodeId,
            bombNodeId
        );
        await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
        await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
        await Animator.animatePathNodes(path);

        // free resource
        useGraphStore.setState({block: false});
        useGraphStore.setState({executing: false});
    }
}

/**
 * Handle clicking the start button. Returns an {@link Exception} if encountered
 * @param algoFile the current FileType (TS), to see the algorithm to run.
 */
const performStartButtonJobs = (
    algoFile: string | NOTSET_t
): Exception => {
    const startNodeId = useGraphStore.getState().startId;
    const endNodeId = useGraphStore.getState().endId;
    const bombNodeId = useGraphStore.getState().bombNodeId;

    // check conditions.
    if (algoFile === NOTSET) return Exception.ALGORITHM_NOTSET;
    else if (startNodeId === NOTSET) return Exception.START_NODE_NOTSET;
    else if (endNodeId === NOTSET) return Exception.END_NODE_NOTSET;
    else if (bombNodeId !== NOTSET && algoFile === 'ts-10') return Exception.BI_DIRECTIONAL_EXTRA_ARGS;

    Syncer.syncInitialGraph();
    // I guess we have to now update the graph.
    // we only update the graph in the backend via the Syncer when we HAVE to run the Algorithm.
    for (const [id, nodeType] of Object.entries(useGraphStore.getState().hexBoard)) {
        match(nodeType)
            .with(NodeType.WALL_NODE, () => Syncer.removeNode(id))
            .with(NodeType.WEIGHT_NODE, () => {
                const srcNode = BackendStateManager.graph().vertices().get(id);
                srcNode.getAdjVertices()
                       .forEach(edge => Syncer.updateEdge(edge.dest, id));
            })
            .otherwise(() => {
            })
    }
    Syncer.cleanHexBoard();

    match(algoFile)
        .with(P.union('ts-1', 'ts-7'),
            async () => await runAlgorithmAnimation(AlgoType.A_STAR_SEARCH,
                {startNodeId, endNodeId, bombNodeId}))
        .with(P.union('ts-2', 'ts-6'),
            async () => await runAlgorithmAnimation(AlgoType.BEST_FIRST_SEARCH,
                {startNodeId, endNodeId, bombNodeId}))
        .with('ts-3', async () => await runAlgorithmAnimation(AlgoType.BREADTH_FIRST_SEARCH,
            {startNodeId, endNodeId, bombNodeId}))
        .with('ts-4', async () => await runAlgorithmAnimation(AlgoType.DEPTH_FIRST_SEARCH,
            {startNodeId, endNodeId, bombNodeId}))
        .with('ts-5', async () => {
            // BLOCK all operations, (this blocks the three buttons)
            useGraphStore.setState({block: true});
            // Notify the Syncer to be ready to sync state via running blocks of code
            // that watch for the 'executing' state.
            useGraphStore.setState({executing: true});
            await Animator.animateRandomWalk(useGraphStore.getState().startId);
            useGraphStore.setState({block: false});
            useGraphStore.setState({randomPathId: NOTSET});
            useGraphStore.setState({executing: false});
        })
        .with('ts-8', async () => await runAlgorithmAnimation(AlgoType.DIJKSTRAS_SEARCH,
            {startNodeId, endNodeId, bombNodeId}))
        .with('ts-10', async () => {
            // BLOCK all operations, (this blocks the three buttons)
            useGraphStore.setState({block: true});
            // Notify the Syncer to be ready to sync state via running blocks of code
            // that watch for the 'executing' state.
            useGraphStore.setState({executing: true});
            if (bombNodeId === NOTSET) {
                const [path, visitedStart, visitedEnd] = biDirectional({
                    graph: BackendStateManager.graph(),
                    startNodeId,
                    endNodeId,
                    nodeAction: (_) => {
                    },
                    edgeAction: (_) => {
                    }
                })
                await Animator.animateVisitedNodes(
                    Pipe.andInterleaveSetsToMap(visitedStart, visitedEnd, NodeType.START_NODE));
                await Animator.animatePathNodes(path);
                useGraphStore.setState({block: false});
                useGraphStore.setState({executing: false});
            } else {
                useGraphStore.setState({block: false});
                useGraphStore.setState({executing: false});
            }
        })
        .with('ts-9', async () => await runAlgorithmAnimation(AlgoType.BELLMAN_FORD,
            {startNodeId, endNodeId, bombNodeId}));

}

/**
 * Handles the click of the start button. It performs all jobs that are required to be run
 * before animations can start (see performStartButtonJobs in this scope)
 * @returns StartButtonError or null, depending on whether an Error was encountered.
 */
export const handleStartButtonClick = (): StartButtonError | null => {

    // First get the active Typescript file for the Algorithm to Run
    const algoFile = useGraphStore.getState().activeFiles.ts;

    // Get the Error (if any)
    const err = performStartButtonJobs(algoFile);

    // Return the Error or null, depending on whatever works.
    return match(err)
        .with(Exception.START_NODE_NOTSET, () => ({
            header: "RTE0001",
            type: "Encountered a Runtime Exception while trying to execute",
            desc: "Start Node is of type NOTSET.",
            fix: "This exception is thrown by the Runtime Environment because no Start Node has" +
                " been selected. Try selecting a Hex as a Start Node lmao"
        }))
        .with(Exception.END_NODE_NOTSET, () => ({
            header: "RTE0002",
            type: "Encountered a Runtime Exception while trying to execute",
            desc: "End Node is of type NOTSET.",
            fix: "This exception is thrown by the Runtime Environment because no End Node has" +
                " been selected. Try selecting a Hex as an End Node lol"
        }))
        .with(Exception.ALGORITHM_NOTSET, () => ({
            header: "RTE0003",
            type: "Encountered a Runtime Exception while trying to execute",
            desc: "No Algorithm has been selected.",
            fix: "You have to select an algorithm to visualise BEFORE visualising (ofc)."
        }))
        .with(Exception.BI_DIRECTIONAL_EXTRA_ARGS, () => ({
            header: "CTE0001",
            type: "Encountered a Compile Time Error while trying to compile",
            desc: "Argument mismatch occurred.",
            fix: "A Bi-Directional Search cannot be started with a Bomb Node, Start Node, and End Node. You must have only two nodes: (Start Node & End Node)."
        }))
        .otherwise(() => null)
};
