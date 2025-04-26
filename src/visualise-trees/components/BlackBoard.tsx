import React, {useEffect, useRef} from "react";
import Node, {SpringyNode} from "./Node";
import * as m from "motion/react";
import ElasticBand from "./elastic-band/ElasticBand";


// TODO, change Node and Edge List to Node and EdgeList in @graphs/ts/Algorithms


// Create a node with initial properties
function createNode(x: number, y: number): SpringyNode {
    return {
        x: m.motionValue(x),
        y: m.motionValue(y),
        vx: 0,
        vy: 0,
        mass: 2,
        isDragging: false,
    };
}

// Function to calculate spring force
const springForce = (dl: number, dist: number, stretch: number, k: number) => {
    return (dl / dist) * stretch * k;
};

// Function to calculate the repulsive force
const repulsiveForce = (n1: SpringyNode, n2: SpringyNode, kRepel: number, minDist: number) => {
    const dx = n2.x.get() - n1.x.get();
    const dy = n2.y.get() - n1.y.get();
    const dist = Math.hypot(dx, dy) || 1;

    if (dist < minDist) {
        const force = kRepel * (minDist - dist) * (minDist - dist);
        const forceX = (dx / dist) * force;
        const forceY = (dy / dist) * force;

        if (!n1.isDragging) {
            n1.vx -= forceX / n1.mass;
            n1.vy -= forceY / n1.mass;
        }

        if (!n2.isDragging) {
            n2.vx += forceX / n2.mass;
            n2.vy += forceY / n2.mass;
        }
    }
};

export const Blackboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Define nodes
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
            const k = 0.5;  // Spring constant
            const damping = 0.5;  // Damping factor
            const restLength = 100;  // Rest length of springs
            const kRepel = 0.05;  // Repulsive force constant
            const minDist = 50;  // Minimum distance to prevent overlap

            // Go over all pairs
            // of connected nodes via their edges
            // and then get the nodes.
            for (const [i1, i2] of edges) {
                const n1 = nodes[i1];
                const n2 = nodes[i2];
                if (!n1 || !n2) continue;

                const dx = n2.x.get() - n1.x.get();
                const dy = n2.y.get() - n1.y.get();
                const dist = Math.max(0.1, Math.hypot(dx, dy));
                const stretch = dist - restLength;

                const forceX = springForce(dx, dist, stretch, k);
                const forceY = springForce(dy, dist, stretch, k);

                if (!n1.isDragging) {
                    n1.vx += forceX / n1.mass;
                    n1.vy += forceY / n1.mass;
                }
                if (!n2.isDragging) {
                    n2.vx -= forceX / n2.mass;
                    n2.vy -= forceY / n2.mass;
                }
            }

            // Apply repulsive force between all pairs of nodes
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    repulsiveForce(nodes[i], nodes[j], kRepel, minDist);
                }
            }

            // Apply movement and damping
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
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black text-white overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {edges.map(([i1, i2], idx) => (
                    <ElasticBand
                        key={idx}
                        x1={nodes[i1].x}
                        y1={nodes[i1].y}
                        x2={nodes[i2].x}
                        y2={nodes[i2].y}
                    />
                ))}
            </svg>

            {nodes.map((springyNodeProps, i) => (
                <Node
                    key={i}
                    id={i}
                    onUpdate={updatePosition}
                    onDragChange={setDragging}
                    {...springyNodeProps}
                />
            ))}
        </div>
    );
};

export default Blackboard;
