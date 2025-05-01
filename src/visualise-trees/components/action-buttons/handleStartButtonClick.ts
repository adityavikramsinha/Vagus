import BackendStateManager from "../../api/BackendStateManager";
import useTreeStore from "../../../stores/TreeStore";

const handleStartButtonClick = () => {
    useTreeStore.getState().nodes.forEach(node => BackendStateManager.graph.addNode(node.id));
    useTreeStore.getState().edgeList.forEach((edgeSet, srcNodeId)=>{
        edgeSet.forEach(edge =>BackendStateManager.graph.addEdge(srcNodeId, edge.dest.getData(), edge.cost))
    })

    // console.log(BackendStateManager.graph);
}


export default handleStartButtonClick;
