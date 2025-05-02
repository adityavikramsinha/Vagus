import React from "react";
import useTreeStore from "@/stores/TreeStore";
import {NOTSET} from "@graph/ts/Types";
import BackendStateManager from "@tree/api/BackendStateManager";

const handleBobClick = (event: React.MouseEvent, destId: string, isDragging: boolean) => {
    // stop propagation of click to parent,
    // since the parent really has nothing to do with this click.
    event.stopPropagation()
    // There is little information about this on MDN, but in a way t
    // this is preventing bubble up of the event.

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
            // Cleanup the srcNode
            useTreeStore.setState({srcNodeId: NOTSET});
        }
    }

    // This is for deleting the Vertex that is currently being clicked, io-1 is the nodeActions file.
    if (!isDragging && useTreeStore.getState().activeFiles.io === 'io-1') {
        const updatedNodes = useTreeStore.getState().nodes;
        updatedNodes.delete(destId);
        BackendStateManager.graph.rmNode(destId);

        // We are removing the node from the node map, but not from srcNodeId,
        // This is because the file is supposed to handle state's related to it
        // and since srcNodeId is something that the edges.io File is controlling
        // we should not interfere with it externally and since this is in a branch
        // that is not for that file (io-2), it makes it really messy to mutate stuff
        // linked to that file here.

        // Instead, the proposed actions is that everytime
        // a file EXCEPT for edges.io is selected, any state related to the edges should
        // be set to NOTSET and revalidated.

        // This way we are not going to run into that error, and it will also be able
        // to enhance the UX/DX, since D's or U's won't have to remember the previous
        // state
        useTreeStore.setState({nodes: new Map(updatedNodes)});
    }
}

export default handleBobClick;
