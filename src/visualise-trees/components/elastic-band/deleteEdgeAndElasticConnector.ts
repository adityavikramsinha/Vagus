import useTreeStore from "../../../stores/TreeStore";
import BackendStateManager from "../../api/BackendStateManager";

/**
 * Handle the Deletion of the Edge as well as the Elastic Connector.
 * @param srcBobId
 * @param destBobId
 */
const deleteEdgeAndElasticConnector = (srcBobId: string, destBobId: string) => {
    const edgeSet = useTreeStore.getState().edgeList.get(srcBobId);
    if (edgeSet) {
        const newEdgeSet = new Set(
            [...edgeSet].filter(edge => edge.dest.getData() !== destBobId)
        );
        const newEdgeList = new Map(useTreeStore.getState().edgeList);
        newEdgeList.set(srcBobId, newEdgeSet);
        BackendStateManager.graph.rmEdge(srcBobId, destBobId);
        useTreeStore.setState({edgeList: newEdgeList})
    }
}

export default deleteEdgeAndElasticConnector;
