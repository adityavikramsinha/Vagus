import React from 'react';
import * as m from 'motion/react';
import handleBobClick from './handleBobClick';
import useTreeStore from '../../../stores/TreeStore';

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
    containerRef: React.RefObject<HTMLDivElement>;
}

const Bob: React.FC<BobProps> = ({ id, x, y, onUpdate, onDragChange, containerRef }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const isFocused = useTreeStore(
        (state) => state.activeFiles.io === 'io-2' && state.srcNodeId === id,
    );
    // Tracks the 'x' & 'y' motion values, and handles the binding of "change" (anything)
    // to both of these props, that way we do not have to think about the cursor position
    const isStartVertex = useTreeStore((state) => state.startId === id);
    const isEndVertex = useTreeStore((state) => state.endId === id);
    const isVisited = useTreeStore((state) => state.visitedVertices.has(id));
    m.useMotionValueEvent(x, 'change', (latestX) => onUpdate(id, latestX, y.get()));
    m.useMotionValueEvent(y, 'change', (latestY) => onUpdate(id, x.get(), latestY));
    return (
        <m.motion.div
            drag
            dragMomentum
            dragConstraints={containerRef}
            onDragStart={() => {
                onDragChange(id, true);
                setIsDragging(true);
            }}
            onDragEnd={() => {
                onDragChange(id, false);
                setIsDragging(false);
            }}
            className="w-[20px] h-[20px] bg-[#FFA684] rounded-[50%] cursor-grab absolute flex justify-center items-center"
            style={{ x, y }}
            variants={{
                visible: {
                    scale: 1,
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    backgroundColor: '#FFA684',
                },
                inFocus: {
                    scale: [1, 1.2, 1],
                    backgroundColor: '#FFA684',
                    boxShadow: [
                        '0 0 10px rgba(255, 166, 132, 1)',
                        '0 0 10px rgba(255, 166, 132, 1)',
                        '0 0 10px rgba(255, 166, 132, 1)',
                    ],
                    transition: {
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                    },
                },
                visited: {
                    backgroundColor: '#84DDFF',
                    scale: [1, 1.5, 1],
                    transition: {
                        scale: {
                            duration: 1,
                            ease: 'easeInOut',
                        },
                        backgroundColor: {
                            ease: 'easeInOut',
                        },
                    },
                },
            }}
            animate={isVisited ? 'visited' : isFocused ? 'inFocus' : 'visible'}
            onClick={(event) => {
                // stop propagation of click to parent,
                // since the parent really has nothing to do with this click.
                event.stopPropagation();
                // There is little information about this on MDN, but in a way t
                // this is preventing bubble up of the event.

                // we do not register Drags as clicks, that's just weird
                if (!isDragging) handleBobClick(id);
            }}
        >
            {/* Conditionally render "S" or "E" inside the SVG */}
            <svg width="20" height="20" className="absolute top-0 left-0 ">
                {isStartVertex && (
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        stroke="#1a1a1a"
                        strokeWidth="1px"
                        dy=".3em"
                        fontSize="12"
                    >
                        S
                    </text>
                )}
                {isEndVertex && (
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        stroke="#1a1a1a"
                        strokeWidth="1px"
                        dy=".3em"
                        fontSize="12"
                    >
                        E
                    </text>
                )}
            </svg>
        </m.motion.div>
    );
};
export default React.memo(Bob);
