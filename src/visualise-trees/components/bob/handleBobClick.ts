import useTreeStore, {VertexActions} from "@/stores/TreeStore";
import {NOTSET} from "@graph/ts/Types";
import BackendStateManager from "@tree/api/BackendStateManager";


/**
 * @param destId id of the bob that was clicked
 * @param MASS_PER_EDGE mass to add when a new edge is formed
 */
const handleBobClick = (destId: string, MASS_PER_EDGE:number =2) => {

    // This is for adding an edge.
    if (useTreeStore.getState().activeFiles.io === 'io-2') {
        // we have to perform a clean-up function so that after an edge has
        // been set up, we can add another edge with a new src and destination
        const srcNode = useTreeStore.getState().srcNodeId;
        if (srcNode === NOTSET)
            useTreeStore.setState({srcNodeId: destId});
        // how does a self edge make sense? DO NOT, allow it.
        else if (srcNode !== destId) {
            const updatedEdgeList = new Map<string, Map<string, number>>(useTreeStore.getState().edgeList);
            if (updatedEdgeList.get(srcNode) === undefined) updatedEdgeList.set(srcNode, new Map())
            const nodeEdges = updatedEdgeList.get(srcNode);
            nodeEdges.set(destId, 0);
            BackendStateManager.graph.addEdge(srcNode, destId, 0);
            useTreeStore.setState({edgeList: updatedEdgeList});
            useTreeStore.getState().nodes.get(srcNode).mass += MASS_PER_EDGE;
            useTreeStore.getState().nodes.get(destId).mass += MASS_PER_EDGE;
            // Cleanup the srcNode
            useTreeStore.setState({srcNodeId: NOTSET});
        }
    }

    // This is for deleting the Vertex that is currently being clicked, io-1 is the nodeActions file.
    else if (useTreeStore.getState().activeFiles.io === 'io-1') {
        useTreeStore.getState().dispatch({type : VertexActions.DELETE , id : destId})
        BackendStateManager.graph.rmNode(destId);
    }
}

export default handleBobClick;
