import React from "react";
import * as m from "motion/react";
import handleBobClick from "./handleBobClick";
import useTreeStore from "../../../stores/TreeStore";

export interface Particle {
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    vx: number;
    vy: number;
    mass: number;
    isDragging: boolean;

}
export interface BobProps extends Particle {
    id: string;
    onUpdate: (index: string, x: number, y: number) => void;
    onDragChange: (index: string, dragging: boolean) => void;
    containerRef : React.RefObject<HTMLDivElement>;
}
const Bob: React.FC<BobProps> = ({id, x, y, onUpdate, onDragChange, containerRef}) => {
    const [isDragging , setIsDragging] = React.useState(false);
    const isFocused = useTreeStore(state => (state.activeFiles.io === 'io-2' && state.srcNodeId === id));
    // Tracks the 'x' & 'y' motion values, and handles the binding of "change" (anything)
    // to both of these props, that way we do not have to think about the cursor position
    m.useMotionValueEvent(x, "change", (latestX) => onUpdate(id, latestX, y.get()));
    m.useMotionValueEvent(y, "change", (latestY) => onUpdate(id, x.get(), latestY));
    return (
        <m.motion.div
            drag
            dragMomentum
            dragConstraints={containerRef}
            onDragStart={() => {
                onDragChange(id, true)
                setIsDragging(true);
            }}
            onDragEnd={() => {
                onDragChange(id, false)
                setIsDragging(false);
            }}
            className="w-[20px] h-[20px] bg-[#FFA684] rounded-[50%] cursor-grab absolute"
            style={{x, y}}
            animate={
                isFocused
                    ? {
                        scale: [1, 1.2, 1],
                        boxShadow: [
                            "0 0 10px rgba(255, 166, 132, 1)",
                            "0 0 10px rgba(255, 166, 132, 1)",
                            "0 0 10px rgba(255, 166, 132, 1)",
                        ],
                        transition: {
                            duration: 1.2,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                        },
                    }
                    : {
                        scale: 1,
                        boxShadow: "0 0 0 rgba(0,0,0,0)",
                    }
            }
            onClick={event => handleBobClick(event, id, isDragging)}
        />
    );
};
export default Bob;
