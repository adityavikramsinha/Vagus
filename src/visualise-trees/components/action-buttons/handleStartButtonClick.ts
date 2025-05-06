import BackendStateManager from "@tree/api/BackendStateManager";
import useTreeStore from "@/stores/TreeStore";
import Animator from "@tree/api/Animator";
import {match} from "ts-pattern";
import Algorithms from "@graph/ts/Algorithms";
import {AlgoType, NOTSET} from "@graph/ts/Types";

const handleStartButtonClick = () => {
    useTreeStore.setState({block: true, executing: true});
    const activeTsFile = useTreeStore.getState().activeFiles.ts;
    const startId = useTreeStore.getState().startNodeId;
    const endId = useTreeStore.getState().endNodeId;
    if (startId === NOTSET || endId === NOTSET)
        return;
    match(activeTsFile)
        .with('ts-1', async () => {
            const {visited, visitedEdges} = Algorithms.runWithoutBombNode(
                AlgoType.BREADTH_FIRST_SEARCH, startId, endId, BackendStateManager.graph)
            await Animator.animateVisitedVertices(visited, visitedEdges)
            useTreeStore.setState({block: false, executing: false});

        })
        .with('ts-2', async () =>{
            const {visited, visitedEdges} = Algorithms.runWithoutBombNode(
                AlgoType.DIJKSTRAS_SEARCH, startId, endId , BackendStateManager.graph)
            await Animator.animateVisitedVertices(visited, visitedEdges);
            useTreeStore.setState({block : false , executing : false})
        })
        .with('ts-3', async () =>{
            const {visited, visitedEdges} = Algorithms.runWithoutBombNode(
                AlgoType.BELLMAN_FORD, startId, endId , BackendStateManager.graph)
            await Animator.animateVisitedVertices(visited, visitedEdges);
            useTreeStore.setState({block : false , executing : false})
        })
}
export default handleStartButtonClick;
