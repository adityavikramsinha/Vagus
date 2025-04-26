import React from "react";
import * as m from "motion/react";
import useTreeStore from "../../stores/TreeStore";

export type SpringyNode = {
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    vx: number;
    vy: number;
    mass: number;
    isDragging: boolean;
    id: number;
};

export type NodeProps = {
    onUpdate: (index: number, x: number, y: number) => void;
    onDragChange: (index: number, dragging: boolean) => void;
};

const Node: React.FC<NodeProps & SpringyNode> = ({id, x, y, onUpdate, onDragChange}) => {

    m.useMotionValueEvent(x, "change", (latestX) => {
        onUpdate(id, latestX, y.get());
    });

    m.useMotionValueEvent(y, "change", (latestY) => {
        onUpdate(id, x.get(), latestY);
    });

    return (
        <m.motion.div
            drag
            dragMomentum
            onDragStart={() => onDragChange(id, true)}
            onDragEnd={() => onDragChange(id, false)}
            className={"w-[25px] h-[25px] bg-orange-300 rounded-[50%] cursor-grabbing absolute"}
            style={{x, y}}
        />
    );
};
export default Node;