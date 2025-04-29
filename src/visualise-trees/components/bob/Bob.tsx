import React from "react";
import * as m from "motion/react";
import useTreeStore from "../../../stores/TreeStore";
import {NOTSET} from "../../../visualise-graphs/ts/Types";
export interface Particle  {
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    vx: number;
    vy: number;
    mass: number;
    isDragging: boolean;
};

export interface BobProps extends Particle{
    id: number;
    onUpdate: (index: number, x: number, y: number) => void;
    onDragChange: (index: number, dragging: boolean) => void;
}

const Bob: React.FC<BobProps> = ({id, x, y, onUpdate, onDragChange}) => {

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
            className={"w-[20px] h-[20px] bg-amber-200 rounded-[50%] cursor-grabbing absolute"}
            style={{x, y}}
            onClick={(event: React.MouseEvent) =>{
                // stop propagation of click to parent,
                // since the parent really has nothing to do with this click.
                event.stopPropagation()
                // There is little information about this on MDN, but in a way t
                // this is preventing bubble up of the event.
                useTreeStore.getState().srcNode === NOTSET ?
                    useTreeStore.setState({srcNode : id})
                    : useTreeStore.setState({destNode : id});

                console.log(useTreeStore.getState().srcNode)
                console.log(useTreeStore.getState().destNode)
            }}
        />
    );
};
export default Bob;