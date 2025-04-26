import React from "react";
import * as m from "motion/react";

export type NodeProps = {
    index: number;
    position: { x: number; y: number };
    onUpdate: (index: number, x: number, y: number) => void;
};

const Node: React.FC<NodeProps> = ({ index, position, onUpdate }) => {
    const ballRef = React.useRef<HTMLDivElement>(null);
    const x = m.useMotionValue(position.x);
    const y = m.useMotionValue(position.y);

    m.useMotionValueEvent(x, "change", (latestX) => {
        onUpdate(index, latestX, y.get());
    });

    m.useMotionValueEvent(y, "change", (latestY) => {
        onUpdate(index, x.get(), latestY);
    });

    return (
        <m.motion.div
            ref={ballRef}
            drag
            dragMomentum
            style={{
                ...ball,
                x,
                y,
                position: "absolute",
                zIndex : 3
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
