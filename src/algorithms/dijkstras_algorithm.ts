import { AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET } from '../visualise-graphs/ts/Types';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

/**
 * Classic implementation of Dijkstras algorithm
 * which opens the nodes using BFS but is weighted.
 * We can call it a weighted BFS in some context.
 *
 * @param inputs an input object of shape {@link AlgorithmApiInputs_t} containing all the
 * information to run this algorithm
 * @returns {@link AlgorithmApiReturn_t}
 */
const dijkstras = (inputs: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {
    const [dist, prev] = internalDijkstras({ ...inputs });
    const path: string[] = [];
    if (dist.get(inputs.endNodeId) === Infinity) return NOTSET;
    for (let at: string = inputs.endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);
    return path;
};

/**
 * Internal implementation of the dijkstras algorithm.
 *
 * @param graph the Graph to use
 * @param startNodeId starting node ID
 * @param endNodeId ending node ID
 * @param nodeAction action to perform on every node dequeue (to preserve the order in Priority
 * Queue)
 * @param edgeAction action to perform whenever a new destination from an opened nodes' edge is
 * added.
 * @returns a dist Map to show the distances between the nodes, a Map which has the prev nodes.
 */
const internalDijkstras = ({
    graph,
    startNodeId,
    endNodeId,
    nodeAction,
    edgeAction,
}: AlgorithmApiInputs_t): [Map<string, number>, Map<string, string>] => {
    type Priority = {
        label: string;
        minDist: number;
    };

    const PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minDist);

    // dist map for shortest distance between
    // a node [A] and the Start node [S]
    const dist: Map<string, number> = new Map(),
        prev: Map<string, string> = new Map();

    const visited: Set<string> = new Set();

    graph.vertices().forEach((node) => {
        const id = node.getData();
        dist.set(id, id === startNodeId ? 0 : Infinity);
    });

    PQ.enqueue({
        label: startNodeId,
        minDist: 0,
    });

    // While it is not empty,
    // nodes should be dequeued from the
    // PQ.
    while (!PQ.isEmpty()) {
        // get the Priority Object and deconstruct it
        const { label, minDist } = PQ.dequeue();
        // add it to visited so that
        // we do not keep opening it.
        visited.add(label);

        // perform the node action.
        nodeAction(label);

        // if the dist > minDist then
        // we know that we can open it
        // since we get a better route.
        if (dist.get(label) < minDist) continue;
        // follow the BFS pattern
        // we open every neighbour
        // and explore it
        // the ordering is based on their min dist
        // hence a priority queue.
        graph
            .vertices()
            .get(label)
            .getAdjVertices()
            .forEach((edge) => {
                // first get the destination node
                const dest = edge.dest;

                // if visited does not have destination
                // then it means that it has not been explored
                // hence there is merit in the fact that it might be
                // helpful to open it.
                if (!visited.has(dest)) {
                    // new Dist will be the dist till now + the cost of moving from
                    // the prev node to this node
                    const newDist = dist.get(label) + edge.cost;

                    // if new Dist < the current dist of the destination
                    // then we add
                    // this is bound to hit every node once
                    // since starting value in distance for every node is
                    // infinity.
                    if (newDist < dist.get(dest)) {
                        prev.set(dest, label);
                        dist.set(dest, newDist);
                        PQ.enqueue({
                            label: dest,
                            minDist: newDist,
                        });
                        // perform edge action
                        edgeAction(edge);
                    }
                }
            });

        // pre mature return.
        if (label === endNodeId) return [dist, prev];
    }
    return [dist, prev];
};

export default dijkstras;
