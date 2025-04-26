import React, {useEffect, useRef} from "react";
import Node from "../Node";
import ElasticBand from "../elastic-band/ElasticBand";
import useTreeStore from "../../../stores/TreeStore";
import * as F from "./forces";
import * as BlackBoardActions from "./handleBlackBoardActions";

let i = 0;

const handleBlackBoardActions = (wasDraggingRef: React.RefObject<boolean>) => {
    const activeIOFile = useTreeStore.getState().activeFiles.io;
    if (activeIOFile === 'io-1') BlackBoardActions.handleAddNode(wasDraggingRef, i++);
}


export const Blackboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wasDraggingRef = useRef(false);
    const nodes = useTreeStore(state => state.nodes);

    const edges: [number, number][] = [
        [0, 1],
        [1, 2],
        [0, 2],
        [0, 3],
        [12, 1],
        [7, 8],
        [4, 3],
        [11, 0],
        [11, 12],
        [9, 10],
        [5, 6],
        [5, 10],
    ];

    // Update node position
    const updatePosition = (index: number, newX: number, newY: number) => {
        if (nodes[index] && nodes[index].isDragging) {
            nodes[index].x.set(newX);
            nodes[index].y.set(newY);
        }
    };

    useEffect(() => {
        let frameId: number;

        const forces = () => {
            const damping = 0.5; // Damping factor
            const restLength = 100; // Rest length of springs
            const minDist = 50; // Minimum distance to prevent overlap

            for (const [i1, i2] of edges) {
                const n1 = nodes[i1];
                const n2 = nodes[i2];
                if (!n1 || !n2) continue;

                const dx = n2.x.get() - n1.x.get();
                const dy = n2.y.get() - n1.y.get();
                const dist = Math.max(0.1, Math.hypot(dx, dy));

                const forceX = F.springForce(dx, dist, dist - restLength, 0.5);
                const forceY = F.springForce(dy, dist, dist - restLength, 0.5);

                if (!n1.isDragging) {
                    n1.vx += forceX / n1.mass;
                    n1.vy += forceY / n1.mass;
                }
                if (!n2.isDragging) {
                    n2.vx -= forceX / n2.mass;
                    n2.vy -= forceY / n2.mass;
                }
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    F.repulsiveForce(nodes[i], nodes[j], 0.05, minDist);
                }
            }

            for (const node of nodes) {
                if (!node.isDragging) {
                    node.vx *= damping;
                    node.vy *= damping;
                    node.x.set(node.x.get() + node.vx);
                    node.y.set(node.y.get() + node.vy);
                }
            }

            frameId = requestAnimationFrame(forces);
        };

        frameId = requestAnimationFrame(forces);

        return () => cancelAnimationFrame(frameId);
    }, [nodes]);

    // Set dragging state
    const setDragging = (index: number, dragging: boolean) => {
        if (nodes[index]) {
            nodes[index].isDragging = dragging;
            if (dragging) {
                wasDraggingRef.current = true;
            }
        }
    };

    return (
        <div
            ref={containerRef}
            onClick={() => handleBlackBoardActions(wasDraggingRef)}
            className="relative w-full h-full bg-black text-white overflow-hidden z-[0]"
        >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {edges.map(([i1, i2], idx) => {
                    const node1 = nodes[i1];
                    const node2 = nodes[i2];

                    if (!node1 || !node2) return null; // Skip invalid edges

                    return (
                        <ElasticBand
                            key={idx}
                            x1={node1.x}
                            y1={node1.y}
                            x2={node2.x}
                            y2={node2.y}
                        />
                    );
                })}
            </svg>
            {nodes.map((springyNodeProps, i) => (
                <Node
                    key={i}
                    onUpdate={updatePosition}
                    onDragChange={setDragging}
                    {...springyNodeProps}
                />
            ))}
        </div>
    );
};

export default Blackboard;
