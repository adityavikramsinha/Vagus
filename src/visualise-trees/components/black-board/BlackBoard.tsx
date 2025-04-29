import React from "react";
import Bob, {BobProps} from "../bob/Bob";
import * as m from "motion/react";
import ElasticBand from "../elastic-band/ElasticBand";
import * as ApplyForce from "./Forces"
import useTreeStore from "../../../stores/TreeStore";
import {NOTSET} from "../../../visualise-graphs/ts/Types";
import handleBlackBoardClick from "./handleBlackBoardClick";
import createBob from "../bob/createBob";

let i = 0;
export const Blackboard = () => {
    const [edges, setEdges] = React.useState<[number, number][]>([
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
    ]);
    const nodes = useTreeStore(state => state.nodes);
    const mouseX = m.motionValue<number>(0);
    const mouseY = m.motionValue<number>(0);
    m.useAnimationFrame(() => {
        const damping = 0.25;  // Damping factor
        const restLength = 100;  // Rest length of spring

        // Go over all pairs
        // of connected nodes via their edges
        // and then get the nodes.
        // Finally apply the spring force over the edges
        for (const [src, dest] of edges) {
            const srcNode = nodes.get(src) as BobProps;
            const destNode = nodes.get(dest) as BobProps;
            if (!srcNode || !destNode) continue;
            ApplyForce.springForce(srcNode, destNode, 0.5, restLength);
        }

        // Apply repulsive force between all pairs of nodes
        for (let i = 0; i < nodes.size; i++)
            for (let j = i + 1; j < nodes.size; j++)
                ApplyForce.repulsive(nodes[i], nodes[j], 0.05, 50);

        // Apply movement and damping
        for (const [_, node] of nodes) {
            if (node !== NOTSET && !node.isDragging) {
                node.vx *= damping;
                node.vy *= damping;
                node.x.set(node.x.get() + node.vx);
                node.y.set(node.y.get() + node.vy);
            }
        }
    })

    return (
        <m.motion.div
            className="relative w-full h-full bg-black text-white overflow-hidden"
            onClick={() => {
                handleBlackBoardClick(nodes, createBob(++i, mouseX.get(), mouseY.get()))
                setEdges(edges)
            }}
            onMouseMove={(event: React.MouseEvent) => {
                const rect = event.currentTarget.getBoundingClientRect();
                mouseX.set(event.clientX - rect.left);
                mouseY.set(event.clientY - rect.top);
            }}
        >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {edges.map(([src, dest], idx) => {
                    if (nodes[src] && nodes[dest]) {
                        return (
                            <ElasticBand
                                key={idx}
                                x1={nodes[src].x}
                                y1={nodes[src].y}
                                x2={nodes[dest].x}
                                y2={nodes[dest].y}
                            />
                        );
                    }
                })}
            </svg>
            {nodes.values().toArray().map(nodeProps => (
                <Bob {...(nodeProps as BobProps)} />
            ))}
        </m.motion.div>
    );
};

export default Blackboard;
