import BackendStateManager from "@tree/api/BackendStateManager";
import useTreeStore from "@/stores/TreeStore";
import Animator from "@tree/api/Animator";
import {match} from "ts-pattern";
import Algorithms from "@graph/ts/Algorithms";
import {AlgoType, NOTSET} from "@graph/ts/Types";
import {Exception, StartButtonError} from "@/components/action-buttons/StartButton";


/**
 * Run algorithm based on the algorithm type from start node to end node with ids'
 * @param algoType
 * @param startNodeId
 * @param endNodeId
 */
const runAlgorithmAnimation = async (algoType: AlgoType,
                                     startNodeId: string, endNodeId: string) => {
    useTreeStore.setState({block: true, executing: true});
    const {visited, visitedEdges} = Algorithms.runWithoutBombNode(
        algoType, startNodeId, endNodeId, BackendStateManager.graph)
    await Animator.animateVisitedVertices(visited, visitedEdges)
    useTreeStore.setState({block: false, executing: false})
}


/**
 * First performs validation checks (like if StartNode exists and EndNode Exists?)
 * Once all checks have passed, it runs the Animation.
 * If checks DO NOT PASS, it returns the Exception (first occurred in order of priority)
 * @returns Exception that was encountered while validation OR nothing if everything is Fine.
 */
const validateAndRun = () => {
    const startId = useTreeStore.getState().startId;
    const endId = useTreeStore.getState().endId;

    if (startId === NOTSET)
        return Exception.START_NODE_NOTSET;
    if (endId === NOTSET)
        return Exception.END_NODE_NOTSET;

    const activeTsFile = useTreeStore.getState().activeFiles.ts;

    match(activeTsFile)
        .with('ts-1',
            async () => runAlgorithmAnimation(AlgoType.BREADTH_FIRST_SEARCH, startId, endId))
        .with('ts-2', async () => runAlgorithmAnimation(AlgoType.DIJKSTRAS_SEARCH, startId, endId))
        .with('ts-3', async () => runAlgorithmAnimation(AlgoType.BELLMAN_FORD, startId, endId))
        .with('ts-4',
            async () => runAlgorithmAnimation(AlgoType.DEPTH_FIRST_SEARCH, startId, endId))

    return null;
}


export const handleStartButtonClick = () : StartButtonError | null => {
    const err = validateAndRun();

    return match(err)
        .with(Exception.START_NODE_NOTSET, () => ({
            header: "RTE 0x01",
            message: `
Encountered a *Runtime Exception* while trying to execute:

→ Start Node is of type NOTSET.

This exception is thrown by the Runtime Environment because no Start Node has been selected.`
        }))
        .with(Exception.END_NODE_NOTSET, () => ({
            header: "RTE 0x02",
            message: `
Encountered a *Runtime Exception* while trying to execute:

→ End Node is NOTSET.

This exception is thrown by the Runtime Environment because no End Node has been selected.`
        }))
        .otherwise(() => null);
}
export default handleStartButtonClick;
