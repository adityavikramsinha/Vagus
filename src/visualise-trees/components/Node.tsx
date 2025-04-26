import React from "react";
import * as m from "motion/react";

export type NodeProps = {
    index: number;
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    onUpdate: (index: number, x: number, y: number) => void;
    onDragChange: (index: number, dragging: boolean) => void;
};
const Node: React.FC<NodeProps> = ({ index, x, y, onUpdate, onDragChange }) => {
    m.useMotionValueEvent(x, "change", (latestX) => {
        onUpdate(index, latestX, y.get());
    });

    m.useMotionValueEvent(y, "change", (latestY) => {
        onUpdate(index, x.get(), latestY);
    });

    return (
        <m.motion.div
            drag
            dragMomentum
            onDragStart={() => onDragChange(index, true)}
            onDragEnd={() => onDragChange(index, false)}
            style={{
                ...ball,
                x,
                y,
                position: "absolute",
                zIndex: 3,
            }}
        />
    );
};

const ball = {
    width: 25,
    height: 25,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: "50%",
    cursor: "grab",
};

export default Node;