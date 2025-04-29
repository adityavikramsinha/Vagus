import React from "react";
import Bob, {BobProps} from "../bob/Bob";
import * as m from "motion/react";
import ElasticBand from "../elastic-band/ElasticBand";
import * as ApplyForce from "./Forces";
import useTreeStore from "../../../stores/TreeStore";
import handleBlackBoardClick from "./handleBlackBoardClick";
import createBob from "../bob/createBob";
import cn from "../../../cn";

let i = 0;
export const Blackboard = () => {
    const edges = useTreeStore(state => state.edgeList);
    const nodes = useTreeStore(state => state.nodes);
    const mouseX = m.motionValue<number>(0);
    const mouseY = m.motionValue<number>(0);
    m.useAnimationFrame(() => {
        const damping = 0.5;  // Damping factor
        const restLength = 150;  // Rest length of spring

        // Go over all pairs
        // of connected nodes via their edges
        // and then get the nodes.
        // Finally apply the spring force over the edges
        for (const [src, edgeList] of edges) {
            const srcNode = nodes.get(src) as BobProps;
            edgeList.forEach(edge => {
                const destNode = nodes.get(parseInt(edge.dest.getData())) as BobProps;
                if (srcNode && destNode)
                    ApplyForce.springForce(srcNode, destNode, 1, restLength);
            })

        }

        // TODO, the repulsive force is not working
        //  since node overlap is happening if the edges are subset identical.
        // Apply repulsive force between all pairs of nodes
        for (let i = 0; i < nodes.size; i++)
            for (let j = i + 1; j < nodes.size; j++)
                ApplyForce.repulsive(nodes[i], nodes[j], 0.5, 50);

        // Apply movement and damping
        for (const [_, node] of nodes) {
            if (!node.isDragging) {
                node.vx *= damping;
                node.vy *= damping;
                node.x.set(node.x.get() + node.vx);
                node.y.set(node.y.get() + node.vy);
            }
        }
    })

    const isAddingEdge = useTreeStore(state => state.activeFiles.io === 'io-2');

    return (
        <m.motion.div
            className={cn("relative w-full h-full bg-black text-white overflow-hidden", {
                "cursor-crosshair": isAddingEdge
            })}
            onClick={() => handleBlackBoardClick(nodes, createBob(++i, mouseX.get(), mouseY.get()))}
            onMouseMove={(event: React.MouseEvent) => {
                const rect = event.currentTarget.getBoundingClientRect();
                mouseX.set(event.clientX - rect.left);
                mouseY.set(event.clientY - rect.top);
            }}
        >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...edges.entries()].flatMap(([src, edgeSet]) => {
                    const srcNode = nodes.get(src);
                    if (!srcNode || edgeSet.size === 0) return [];
                    return [...edgeSet.values()].map((edge, i) => {
                        const destNode = nodes.get(parseInt(edge.dest.getData()));
                        if (!destNode) return null;
                        return (
                            <ElasticBand
                                key={`${src}-${edge.dest.getData()}-${i}`}
                                srcBob={nodes.get(src)}
                                destBob={destNode}
                            />
                        );
                    });
                })}
            </svg>
            {nodes.values().toArray().map(nodeProps => (
                <Bob key={nodeProps.id} {...(nodeProps as BobProps)} />
            ))}
        </m.motion.div>
    );
};

export default Blackboard;
