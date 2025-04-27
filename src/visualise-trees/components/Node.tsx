import React from "react";
import * as m from "motion/react";

export type Particle = {
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    vx: number;
    vy: number;
    mass: number;
    isDragging: boolean;
};

export type NodeProps = {
    id: number;
    onUpdate: (index: number, x: number, y: number) => void;
    onDragChange: (index: number, dragging: boolean) => void;
} & Particle;

const Node: React.FC<NodeProps> = ({id, x, y, onUpdate, onDragChange}) => {

    // Tracks the 'x' & 'y' motion values, and handles the binding of "change" (anything)
    // to both of these props, that way we do not have to think about the cursor position
    m.useMotionValueEvent(x, "change", (latestX) => onUpdate(id, latestX, y.get()));
    m.useMotionValueEvent(y, "change", (latestY) => onUpdate(id, x.get(), latestY));
    return (
        <m.motion.div
            drag
            dragMomentum
            onDragStart={() => onDragChange(id, true)}
            onDragEnd={() => onDragChange(id, false)}
            className={"w-[25px] h-[25px] bg-amber-200 rounded-[50%] cursor-grabbing absolute"}
            style={{x, y}}
        />
    );
};
export default Node;