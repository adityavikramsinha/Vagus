import useTreeStore from "../../../stores/TreeStore";
import BackendStateManager from "../../api/BackendStateManager";

/**
 * Handle the Deletion of the Edge as well as the Elastic Connector.
 * @param srcBobId
 * @param destBobId
 */
const deleteEdgeAndElasticConnector = (srcBobId: string, destBobId: string) => {
    const edgeMap = useTreeStore.getState().edgeList.get(srcBobId);
    if (edgeMap) {
        const newEdgeMap = new Map(
            [...edgeMap].filter(([destId, _]) => destId!== destBobId)
        );
        const newEdgeList = new Map(useTreeStore.getState().edgeList);
        newEdgeList.set(srcBobId, newEdgeMap);
        BackendStateManager.graph.rmEdge(srcBobId, destBobId);
        useTreeStore.setState({edgeList: newEdgeList})
    }
}

export default deleteEdgeAndElasticConnector;
