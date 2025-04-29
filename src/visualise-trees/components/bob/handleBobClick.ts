import React from "react";
import useTreeStore from "../../../stores/TreeStore";
import {NOTSET} from "../../../visualise-graphs/ts/Types";

const handleBobClick = (event : React.MouseEvent,id: number, isDragging : boolean) => {
    // stop propagation of click to parent,
    // since the parent really has nothing to do with this click.
    event.stopPropagation()
    // There is little information about this on MDN, but in a way t
    // this is preventing bubble up of the event.
    useTreeStore.getState().srcNode === NOTSET ?
        useTreeStore.setState({srcNode: id})
        : useTreeStore.setState({destNode: id});
    if (!isDragging && useTreeStore.getState().activeFiles.io === 'io-1') {
        const updatedNodes = useTreeStore.getState().nodes;
        updatedNodes.delete(id)
        useTreeStore.setState({nodes: new Map(updatedNodes)});
    }
}

export default handleBobClick;