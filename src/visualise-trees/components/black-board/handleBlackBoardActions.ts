import React from "react";
import useTreeStore from "../../../stores/TreeStore";
import * as m from "motion/react";


export const handleAddNode = (wasDraggingRef: React.RefObject<boolean>, id) => {
    if (wasDraggingRef.current) {
        wasDraggingRef.current = false; // Reset.
        return; // prevent node creation of dragged
    }
    useTreeStore.setState(state => ({
        nodes: [...state.nodes, {
            id: id,
            x: m.motionValue(300),
            y: m.motionValue(300),
            vx: 0,
            vy: 0,
            mass: 2,
            isDragging: false,
        }],
    }));
}