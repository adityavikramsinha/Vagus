import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import Pipe from "@graph/api/Pipe";
import Syncer from "@graph/api/Syncer";
import Algorithms from "@graph/ts/Algorithms";
import {AlgoType, NOTSET, NOTSET_t} from "@graph/ts/Types";
import {match, P} from "ts-pattern";
import BackendStateManager from "@graph/api/BackendStateManager";
import Animator from "@graph/api/Animator";

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
    type:AlgoType, {startNodeId, endNodeId, bombNodeId}:{
        startNodeId:number,
        endNodeId:number,
        bombNodeId : number | NOTSET_t
    })=>{
    // BLOCK all operations, (this blocks the three buttons)
    useFrontendStateManager.setState({block : true});
    // Notify the Syncer to be ready to sync state via running blocks of code
    // that watch for the 'executing' state.
    useFrontendStateManager.setState({executing : true});
    if (bombNodeId === NOTSET) {
        const {path, visited} = Algorithms.runWithoutBombNode(
            type,
            startNodeId,
            endNodeId
        );
        await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
        await Animator.animatePathNodes(path);

        // free resource
        useFrontendStateManager.setState({block : false});
        useFrontendStateManager.setState({executing : false});
    } else {
        const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
            type,
            startNodeId,
            endNodeId,
            bombNodeId
        );
        await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
        await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
        await Animator.animatePathNodes(path);

        // free resource
        useFrontendStateManager.setState({block : false});
        useFrontendStateManager.setState({executing : false});
    }
}

export enum Exception {
    START_NODE_NOTSET,
    END_NODE_NOTSET,
    ALGORITHM_NOTSET,
    BI_DIRECTIONAL_EXTRA_ARGS
}

/**
 * Handle clicking the start button. Returns an {@link Exception} if encountered
 * @param algoFile the current FileType (TS), to see the algorithm to run.
 */
export const startButtonClick = (
    algoFile: string | NOTSET_t
): Exception => {
    const startNodeId = useFrontendStateManager.getState().startNodeId;
    const endNodeId = useFrontendStateManager.getState().endNodeId;
    const bombNodeId = useFrontendStateManager.getState().bombNodeId;

    // check conditions.
    if (algoFile === NOTSET) return Exception.ALGORITHM_NOTSET;
    else if (startNodeId === NOTSET) return Exception.START_NODE_NOTSET;
    else if (endNodeId === NOTSET) return Exception.END_NODE_NOTSET;
    else if(bombNodeId !== NOTSET && algoFile === 'ts-10') return Exception.BI_DIRECTIONAL_EXTRA_ARGS;

    Syncer.syncInitialGraph();
    // I guess we have to now update the graph.
    // we only update the graph in the backend via the Syncer when we HAVE to run the Algorithm.
    for (const [nodeKey, nodeType] of Object.entries(useFrontendStateManager.getState().hexBoard)) {
        const id = Number(nodeKey);
        match(nodeType)
            .with(NodeType.WALL_NODE, () => Syncer.removeNode(id))
            .with(NodeType.WEIGHT_NODE, () => {
                const srcNode = BackendStateManager.graph().nodes().get(id);
                srcNode.getAdjNodes().forEach(edge => Syncer.updateEdge(edge.dest.getData(), id));
            })
            .otherwise(() => {
            })
    }
    Syncer.cleanHexBoard();

    match(algoFile)
        .with(P.union('ts-1', 'ts-7'), async () => await runAlgorithmAnimation(AlgoType.A_STAR_SEARCH, {startNodeId,endNodeId,bombNodeId}))
        .with(P.union('ts-2', 'ts-6'), async () => await runAlgorithmAnimation(AlgoType.BEST_FIRST_SEARCH,  {startNodeId,endNodeId,bombNodeId}))
        .with('ts-3', async () => await runAlgorithmAnimation(AlgoType.BREADTH_FIRST_SEARCH, {startNodeId, endNodeId, bombNodeId}))
        .with('ts-4', async () => await runAlgorithmAnimation(AlgoType.DEPTH_FIRST_SEARCH, {startNodeId, endNodeId, bombNodeId} ))
        .with('ts-5', async () => {
            // BLOCK all operations, (this blocks the three buttons)
            useFrontendStateManager.setState({block : true});
            // Notify the Syncer to be ready to sync state via running blocks of code
            // that watch for the 'executing' state.
            useFrontendStateManager.setState({executing : true});
            await Animator.animateRandomWalk(useFrontendStateManager.getState().startNodeId);
            useFrontendStateManager.setState({block: false});
            useFrontendStateManager.setState({randomPathId: NOTSET});
            useFrontendStateManager.setState({executing : false});
        })
        .with('ts-8', async () => await runAlgorithmAnimation(AlgoType.DIJKSTRAS_SEARCH, {startNodeId, endNodeId, bombNodeId}))
        .with('ts-10', async () => {
            // BLOCK all operations, (this blocks the three buttons)
            useFrontendStateManager.setState({block : true});
            // Notify the Syncer to be ready to sync state via running blocks of code
            // that watch for the 'executing' state.
            useFrontendStateManager.setState({executing : true});
            if (bombNodeId === NOTSET) {
                const [path, visitedStart, visitedEnd] = Algorithms.biDirectional(
                    startNodeId,
                    endNodeId
                )
                await Animator.animateVisitedNodes(
                    Pipe.andInterleaveSetsToMap(visitedStart, visitedEnd, NodeType.START_NODE));
                await Animator.animatePathNodes(path);
                useFrontendStateManager.setState({block : false});
                useFrontendStateManager.setState({executing : false});
            } else {
                useFrontendStateManager.setState({block : false});
                useFrontendStateManager.setState({executing : false});
            }
        })
        .with('ts-9', async () => await runAlgorithmAnimation(AlgoType.BELLMAN_FORD, {startNodeId, endNodeId , bombNodeId}));

}
