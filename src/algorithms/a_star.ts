import { AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET } from '../visualise-graphs/ts/Types';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

/**
 * Internal implementation of the a-star algorithm
 * This algorithm uses EPS [10^-5] for balancing factor
 * between edge weight and edge node distance.
 *
 * @param graph the Graph to use
 * @param startNodeId starting node ID
 * @param endNodeId ending node ID
 * @param nodeAction action to perform on every node dequeue (to preserve the order in Priority
 * Queue)
 * @param edgeAction action to perform whenever a new destination from an opened nodes' edge is
 * added.
 * @returns two Maps, first is dist and second is prev
 */
const internalAStar = ({
    graph,
    startNodeId,
    endNodeId,
    nodeAction,
    edgeAction,
}: AlgorithmApiInputs_t): [Map<string, number>, Map<string, string>] => {
    type Priority = {
        // UID of node
        label: string;
        // min distance from [S]
        minDist: number;
        // min heuristic cost from [S]
        minHeuristic: number;
    };

    // making the priority queue to
    // sort the data in the opening nodes
    // the distance map is for understanding if a path exists or not
    // the visited set is to make decisions about whether a node should be opened or not
    const pq = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minHeuristic);
    const dist: Map<string, number> = new Map(),
        prev: Map<string, string> = new Map();
    const visited: Set<string> = new Set();

    // set the distances to infinity
    graph.vertices().forEach((node) => {
        const id = node.getData();
        dist.set(id, id === startNodeId ? 0 : Infinity);
    });

    const startNode = graph.vertices().get(startNodeId),
        endNode = graph.vertices().get(endNodeId);

    // Enqueue the first item
    // this way, the pq is always > 0 when starting.
    pq.enqueue({
        label: startNodeId,
        minDist: 0,
        minHeuristic: graph.distBw(startNode.coordinates(), endNode.coordinates()),
    });

    // keeps going while pq is not empty
    while (!pq.isEmpty()) {
        const { label, minDist } = pq.dequeue();

        // add to visited to say that this node has been opened
        // and if we come across this node again, we will not try
        // to open it or enqueue it.
        visited.add(label);

        // perform the nodeAction as promised
        // after the De-Queue-ing of the node.
        nodeAction(label);
        // if we see that the current minDist is > the dist present in the Map
        // then it is evident that there is no point in trying to explore it since
        // it may not yield a better path.
        if (dist.get(label) < minDist) continue;

        // open all the neighbour nodes
        // same as a bfs search
        graph
            .vertices()
            .get(label)
            .getAdjVertices()
            .forEach((edge) => {
                const destData = edge.dest;

                // perform the edge action
                // since we have opened an edge.
                edgeAction(edge);
                // if visited does not have the node
                // then only do we open it.
                // else we can already confirm that all the nodes
                // have either been opened or explored or are going to
                // be explored we do not need to add anymore.
                if (!visited.has(destData)) {
                    const newDist = dist.get(label) + edge.cost;

                    // get heuristics from the previous node
                    // and node to next
                    const destNode = graph.vertices().get(destData);
                    const latestHeuristicScore =
                        (graph.distBw(destNode.coordinates(), endNode.coordinates(), 'e') /
                            1000000) *
                        newDist;

                    // Only update if we have found a better cost than the
                    // one that iws currently there in the dist Map.
                    if (newDist < dist.get(destData)) {
                        prev.set(destData, label);
                        dist.set(destData, newDist);
                        pq.enqueue({
                            label: destData,
                            minDist: newDist,
                            minHeuristic: latestHeuristicScore,
                        });
                    }
                }
            });

        // premature retreat
        // if we find the endNodeId.
        if (label === endNodeId) return [dist, prev];
    }
    return [dist, prev];
};

/**
 * Classic a-star implementation using heuristics and weights, where the
 * formula for the Heuristic is given as distance between 2 nodes * 1e-5 * edge weight.
 *
 * @param inputs object as defined in {@link AlgorithmApiInputs_t} for the Api
 * @returns {@link AlgorithmApiReturn_t} as promised by the Api.
 */
const aStar = (inputs: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {
    const [dist, prev] = internalAStar({ ...inputs });
    const path: string[] = [];

    // if distance is infinity,
    // we automatically understand no path is possible
    // thus, return NOTSET
    if (dist.get(inputs.endNodeId) === Infinity) return NOTSET;
    for (let at: string = inputs.endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);
    return path;
};

export default aStar;
