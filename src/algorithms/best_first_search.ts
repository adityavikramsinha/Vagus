import {
    AlgorithmApiInputs_t,
    AlgorithmApiReturn_t,
    NOTSET,
    NOTSET_t,
} from '../visualise-graphs/ts/Types';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

/**
 * A classic greedy algorithm which only uses heuristic approach
 * it is an unguided and unweighted a-star algorithm
 * and cannot guarantee best or shortest path in tough situations.
 *
 * @param graph The Graph to use
 * @param start starting node ID
 * @param end ending node ID
 * @returns a path | NOTSET [path if found, else NOTSET] and a Set of visited nodes inorder.
 */
const bestFirstSearch = (inputs: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {
    const prev = internalBestFirstSearch({ ...inputs });
    if (prev === NOTSET) return NOTSET;
    const path: string[] = [];
    for (let at = inputs.endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);
    return path;
};

/**
 * Implementation of Best First Search that uses distance between two nodes as Heuristic.
 *
 * @param graph the Graph to use
 * @param startNodeId starting ID
 * @param endNodeId ending ID
 * @param nodeAction action to perform arbitrarily (since Bellman Ford is node agnostic). There
 * are no guarantees regarding if every node will go through this action, just that each node
 * that is visited OR opened will have action called on it.
 * @param edgeAction action to perform everytime an edge is visited.
 * @returns a Map of previous nodes to construct a path.
 */
const internalBestFirstSearch = ({
    graph,
    startNodeId,
    endNodeId,
    nodeAction,
    edgeAction,
}: AlgorithmApiInputs_t): Map<string, string> | NOTSET_t => {
    type Priority = {
        // name of the node or its ID
        label: string;

        // min heuristic cost to end node [end]
        minHeuristic: number;
    };

    const pq = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minHeuristic);

    // prev is to reconstruct path
    const prev: Map<string, string> = new Map();

    // visited is for remembering which nodes
    // have been visited
    const visited: Set<string> = new Set();
    const startNode = graph.vertices().get(startNodeId),
        endNode = graph.vertices().get(endNodeId);

    // we enqueue the starting node
    pq.enqueue({
        label: startNodeId,
        minHeuristic: graph.distBw(startNode.coordinates(), endNode.coordinates()),
    });

    while (!pq.isEmpty()) {
        const { label } = pq.dequeue();
        visited.add(label);

        // since dequeued, perform the node action
        // to preserve order.
        nodeAction(label);

        graph
            .vertices()
            .get(label)
            .getAdjVertices()
            .forEach((edge) => {
                const destData = edge.dest;
                const dest = graph.vertices().get(destData);

                // if visited does not have those nodes
                // it means there is a possibility of a better path
                // hence we should enqueue them
                if (!visited.has(destData)) {
                    const newHeuristic = graph.distBw(dest.coordinates(), endNode.coordinates());
                    edgeAction(edge);
                    // we enqueue and then set the nodes as required
                    pq.enqueue({ label: destData, minHeuristic: newHeuristic });
                    prev.set(destData, label);
                }
            });

        // premature return if we reach endNodeId
        // since this is a guarantee A PATH exists.and
        // that the shortest path HAS been computed
        // Basic guarantee of Dijkstra and any of the
        // other algorithms that follow a similar approach.
        if (label === endNodeId) return prev;
    }
    return NOTSET;
};

export default bestFirstSearch;
