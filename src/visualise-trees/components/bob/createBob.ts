import * as m from "motion/react";
import {BobProps} from "./Bob";
import useTreeStore from "../../../stores/TreeStore";
const createBob  = (
    id: number,
    x: number,
    y: number,
    mass: number = 2,
    vx: number = 0,
    vy: number = 0,
): BobProps => {
    return {
        id: id,
        x: m.motionValue(x),
        y: m.motionValue(y),
        vx: vx,
        vy: vy,
        mass: mass,
        onUpdate: (index: number, newX: number, newY: number) => {
            if (useTreeStore.getState().nodes[index] && useTreeStore.getState().nodes[index].isDragging) {
                useTreeStore.getState().nodes[index].x.set(newX);
                useTreeStore.getState().nodes[index].y.set(newY);
            }
        },
        onDragChange: (index: number, dragging: boolean) => {
            if (useTreeStore.getState().nodes[index]) useTreeStore.getState().nodes[index].isDragging = dragging;
        },
        isDragging: false,

    };
}

export default createBob;