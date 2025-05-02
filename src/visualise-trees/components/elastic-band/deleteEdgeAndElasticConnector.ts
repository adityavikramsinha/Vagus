import useTreeStore from "../../../stores/TreeStore";
import BackendStateManager from "../../api/BackendStateManager";

/**
 * Handle the Deletion of the Edge as well as the Elastic Connector.
 * @param srcBobId
 * @param destBobId
 * @param MASS_PER_EDGE additional mass that is added to each formed edge and removed from each broken edge.
 */
const deleteEdgeAndElasticConnector = (srcBobId: string, destBobId: string, MASS_PER_EDGE: number = 2) => {
    const edgeMap = useTreeStore.getState().edgeList.get(srcBobId);
    if (edgeMap) {
        useTreeStore.getState().nodes.get(srcBobId).mass -= MASS_PER_EDGE;
        useTreeStore.getState().nodes.get(destBobId).mass -= MASS_PER_EDGE;
        const newEdgeMap = new Map(
            [...edgeMap].filter(([destId, _]) => destId !== destBobId)
        );
        const newEdgeList = new Map(useTreeStore.getState().edgeList);
        newEdgeList.set(srcBobId, newEdgeMap);
        BackendStateManager.graph.rmEdge(srcBobId, destBobId);
        useTreeStore.setState({edgeList: newEdgeList})
    }
}

export default deleteEdgeAndElasticConnector;
