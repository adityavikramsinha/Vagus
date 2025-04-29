import React from "react";
import * as m from "motion/react";
import handleBobClick from "./handleBobClick";

export interface Particle {
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    vx: number;
    vy: number;
    mass: number;
    isDragging: boolean;
}

export interface BobProps extends Particle {
    id: number;
    onUpdate: (index: number, x: number, y: number) => void;
    onDragChange: (index: number, dragging: boolean) => void;
}
const Bob: React.FC<BobProps> = ({id, x, y, onUpdate, onDragChange}) => {


    const [isDragging , setIsDragging] = React.useState(false);
    // Tracks the 'x' & 'y' motion values, and handles the binding of "change" (anything)
    // to both of these props, that way we do not have to think about the cursor position
    m.useMotionValueEvent(x, "change", (latestX) => onUpdate(id, latestX, y.get()));
    m.useMotionValueEvent(y, "change", (latestY) => onUpdate(id, x.get(), latestY));
    return (
        <m.motion.div
            drag
            dragMomentum
            onDragStart={() => {
                onDragChange(id, true)
                setIsDragging(true);
            }}
            onDragEnd={() => {
                onDragChange(id, false)
                setIsDragging(false);
            }}
            className={"w-[20px] h-[20px] bg-amber-200 rounded-[50%] cursor-grabbing absolute"}
            style={{x, y}}
            onClick={(event: React.MouseEvent) => handleBobClick(event, id, isDragging)}
        />
    );
};
export default Bob;