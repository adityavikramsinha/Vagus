import React from "react";
import Node, {NodeProps} from "../Node";
import * as m from "motion/react";
import ElasticBand from "../elastic-band/ElasticBand";
import * as ApplyForce from "./Forces"

// TODO, change Node and Edge List to Node and EdgeList in @graphs/ts/Algorithms

export const Blackboard = () => {
    const createNode = (
        id: number,
        x: number,
        y: number,
        mass: number = 2,
        vx:number = 0,
        vy:number = 0,
    ): NodeProps => {
        return {
            id: id,
            x: m.motionValue(x),
            y: m.motionValue(y),
            vx: vx,
            vy: vy,
            mass: mass,
            onUpdate: (index: number, newX: number, newY: number) => {
                if (nodes[index] && nodes[index].isDragging) {
                    nodes[index].x.set(newX);
                    nodes[index].y.set(newY);
                }
            },
            onDragChange: (index: number, dragging: boolean) => {
                if (nodes[index]) nodes[index].isDragging = dragging;
            },
            isDragging: false,

        };
    }
    const nodes = [
        createNode(0, 100, 100),
        createNode(1, 300, 300, 100),
        createNode(2, 400, 300),
        createNode(3, 500, 500, 40),
        createNode(4, 500, 500),
        createNode(5, 500, 500, 40),
        createNode(6, 500, 500),
        createNode(7, 500, 500),
        createNode(8, 500, 500, 70),
        createNode(9, 500, 500),
        createNode(10, 500, 500, 90),
        createNode(11, 500, 500),
        createNode(12, 500, 500, 10),
    ];

    const edges: [number, number][] = [
        [0, 1],
        [1, 2],
        [0, 2],
        [0, 3],
        [3, 2],
        [12, 1],
        [7, 8],
        [4, 3],
        [11, 0],
        [11, 12],
        [9, 10],
        [5, 6],
        [5, 10],
    ];
    React.useEffect(() => {
        let frameId: number;

        const forces = () => {
            const damping = 0.25;  // Damping factor
            const restLength = 100;  // Rest length of spring

            // Go over all pairs
            // of connected nodes via their edges
            // and then get the nodes.
            // Finally apply the spring force over the edges
            for (const [src, dest] of edges) {
                const srcNode = nodes[src];
                const destNode = nodes[dest];
                if (!srcNode || !destNode) continue;
                ApplyForce.springForce(srcNode, destNode, 0.5, restLength);
            }

            // Apply repulsive force between all pairs of nodes
            for (let i = 0; i < nodes.length; i++)
                for (let j = i + 1; j < nodes.length; j++)
                    ApplyForce.repulsive(nodes[i], nodes[j], 0.05, 50);

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

    return (
        <div className="relative w-full h-full bg-black text-white overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {edges.map(([src, dest], idx) => (
                    <ElasticBand
                        key={idx}
                        x1={nodes[src].x}
                        y1={nodes[src].y}
                        x2={nodes[dest].x}
                        y2={nodes[dest].y}
                    />
                ))}
            </svg>

            {nodes.map((nodeProps) => (
                <Node
                    {...nodeProps}
                />
            ))}
        </div>
    );
};

export default Blackboard;
