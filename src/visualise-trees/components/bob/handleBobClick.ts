import React from "react";
import useTreeStore from "../../../stores/TreeStore";
import {NOTSET} from "../../../visualise-graphs/ts/Types";
import Edge from "../../../visualise-graphs/ts/Edge";
import Vertex from "../../../visualise-graphs/ts/Vertex";

const handleBobClick = (event: React.MouseEvent, id: string, isDragging: boolean) => {
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
            useTreeStore.setState({srcNodeId: id});
        // how does a self edge make sense? DO NOT, allow it.
        else if (srcNode !== id) {
            const updatedEdgeList = new Map(useTreeStore.getState().edgeList);
            const destNode = new Vertex(id.toString(), (a, b) => parseInt(a) - parseInt(b));
            if (updatedEdgeList.get(srcNode) === undefined) {
                updatedEdgeList.set(srcNode, new Set());
            }
            const nodeEdges = updatedEdgeList.get(srcNode);
            nodeEdges.add(new Edge(destNode, 0));
            useTreeStore.setState({edgeList: updatedEdgeList});
            // Cleanup the srcNode
            useTreeStore.setState({srcNodeId: NOTSET});
        }
    }

    // This is for deleting the Vertex that is currently being clicked, io-1 is the nodeActions file.
    if (!isDragging && useTreeStore.getState().activeFiles.io === 'io-1') {
        const updatedNodes = useTreeStore.getState().nodes;
        updatedNodes.delete(id)
        useTreeStore.setState({nodes: new Map(updatedNodes)});
    }
}

export default handleBobClick;
