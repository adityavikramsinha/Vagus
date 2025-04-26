import React, { useRef, useEffect } from "react";
import Node from "./Node";
import * as m from "motion/react";
import ElasticBand from "./ElasticBand";

type SpringNode = {
    x: m.MotionValue<number>;
    y: m.MotionValue<number>;
    vx: number;
    vy: number;
    mass: number;
    isDragging: boolean;
};

function createNode(x: number, y: number): SpringNode {
    return {
        x: m.motionValue(x),
        y: m.motionValue(y),
        vx: 0,
        vy: 0,
        mass: 1,
        isDragging: false,
    };
}

export const Blackboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const nodes = [
        createNode(100, 100),
        createNode(300, 300),
        createNode(400, 300),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
        createNode(500, 500),
    ];

    const updatePosition = (index: number, newX: number, newY: number) => {
        if (nodes[index] && nodes[index].isDragging) {
            nodes[index].x.set(newX);
            nodes[index].y.set(newY);
        }
    };

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

    useEffect(() => {
        let frameId: number;

        const spring = () => {
            const k = 0.01;
            const damping = 0.8;
            const restLength = 150;

            for (const [i1, i2] of edges) {
                const n1 = nodes[i1];
                const n2 = nodes[i2];
                if (!n1 || !n2) continue;

                const dx = n2.x.get() - n1.x.get();
                const dy = n2.y.get() - n1.y.get();
                const dist = Math.max(0.1, Math.hypot(dx, dy));
                const stretch = dist - restLength;

                const forceX = (dx / dist) * stretch * k;
                const forceY = (dy / dist) * stretch * k;

                if (!n1.isDragging) {
                    n1.vx += forceX / n1.mass;
                    n1.vy += forceY / n1.mass;
                }
                if (!n2.isDragging) {
                    n2.vx -= forceX / n2.mass;
                    n2.vy -= forceY / n2.mass;
                }
            }

            // Apply movement
            for (const node of nodes) {
                if (!node.isDragging) {
                    node.vx *= damping;
                    node.vy *= damping;
                    node.x.set(node.x.get() + node.vx);
                    node.y.set(node.y.get() + node.vy);
                }
            }

            frameId = requestAnimationFrame(spring);
        };

        frameId = requestAnimationFrame(spring);

        return () => cancelAnimationFrame(frameId);
    }, [nodes]);

    const setDragging = (index: number, dragging: boolean) => {
        if (nodes[index]) {
            nodes[index].isDragging = dragging;
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black text-white overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {edges.map(([i1, i2], idx) => (
                    <ElasticBand
                        key={idx}
                        start={{ x: nodes[i1].x, y: nodes[i1].y }}
                        end={{ x: nodes[i2].x, y: nodes[i2].y }}
                    />
                ))}
            </svg>

            {nodes.map((node, i) => (
                <Node
                    key={i}
                    index={i}
                    x={node.x}
                    y={node.y}
                    onUpdate={updatePosition}
                    onDragChange={setDragging}
                />
            ))}
        </div>
    );
};

export default Blackboard;
