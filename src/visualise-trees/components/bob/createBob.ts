import * as m from "motion/react";
import {BobProps} from "./Bob";
import useTreeStore from "../../../stores/TreeStore";
import {v4} from "uuid";
import React from "react";
const createBob  = (
    x: number,
    y: number,
    containerRef : React.RefObject<HTMLDivElement>,
    mass: number = 2,
    vx: number = 0,
    vy: number = 0,
): BobProps => {
    return {
        id: v4(),
        x: m.motionValue(x),
        y: m.motionValue(y),
        vx,vy, mass,
        onUpdate: (index: string, newX: number, newY: number) => {
            if (useTreeStore.getState().nodes[index] && useTreeStore.getState().nodes[index].isDragging) {
                useTreeStore.getState().nodes[index].x.set(newX);
                useTreeStore.getState().nodes[index].y.set(newY);
            }
        },
        onDragChange: (index: string, dragging: boolean) => {
            if (useTreeStore.getState().nodes[index]) useTreeStore.getState().nodes[index].isDragging = dragging;
        },
        isDragging: false, containerRef
    };
}

export default createBob;
