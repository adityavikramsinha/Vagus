import { AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET } from '../visualise-graphs/ts/Types';

/**
 * Classic Bellman Ford that cycles over edge list V-1 times
 * and for shortest path node relaxation
 *
 * @param inputs object of inputs as specified in {@link AlgorithmApiInputs_t}
 * @returns {@link AlgorithmApiReturn_t}
 */
const bellmanFord = (inputs: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {
    const [dist, prev] = internalBellmanFord({ ...inputs });

    // path array
    const path: string[] = [];

    // checking for if the last node [end] was relaxed or not
    // if not then we know that no path exists so return NOTSET.
    if (dist.get(inputs.endNodeId) === Infinity) return NOTSET;
    for (let at = inputs.endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);
    return path;
};

/**
 * Simple implementation of Bellman ford that is capable of finding the least cost path
 * in O(E*V^2) time for negative weights too but does not detect cycles.
 *
 * @param graph the Graph to use
 * @param startNodeId starting ID
 * @param endNodeId ending ID
 * @param nodeAction action to perform arbitrarily (since Bellman Ford is node agnostic). There
 * are no guarantees regarding if every node will go through this action, just that each node
 * that is visited OR opened will have action called on it.
 * @param edgeAction action to perform everytime an edge is visited.
 * @returns a Map of relaxed distances from start node [S] to all other nodes
 * a Map of previous nodes to construct a path and,
 * a Set of visited nodes.
 */
const internalBellmanFord = ({
    graph,
    startNodeId,
    nodeAction,
    edgeAction,
}: AlgorithmApiInputs_t): [Map<string, number>, Map<string, string>] => {
    // dist is for the possibility of relaxation
    // this also signifies if a path from the start -> end
    // exists since if end is not relaxed [i.e. end remains Infinity]
    // it means it is unreachable. Prev is a Map that helps in
    // path reconstruction.
    const dist: Map<string, number> = new Map();
    const visited: Set<string> = new Set();
    const prev: Map<string, string> = new Map();

    graph.vertices().forEach((node) => {
        const id = node.getData();
        dist.set(id, id === startNodeId ? 0 : Infinity);
    });

    // then we take the count of the number of vertices
    // since Bellman ford must go from 0...V-1 (at most). It can end before
    // too.
    const V = graph.vertices().size;

    // this keeps track of number of relaxations in a pass through
    // if the changes goes down to 0, then we know any subsequent pass will yield the same
    // results so we can ignore 0...V-1 and do less
    // it's a quirky optimisation.
    let changes = 1;

    for (let v = 0; v < V - 1 && changes > 0; v++) {
        changes = 0;
        // each time we go through each node of the graph
        graph.vertices().forEach((v) => {
            // perform the node action.
            nodeAction(v.getData());
            // and each edge in the graph from this node
            // we open it up and try to see if
            // relaxation is possible or not
            v.getAdjVertices().forEach((edge) => {
                // if visited does not have the node
                // we simply add it.
                if (!visited.has(edge.dest)) visited.add(edge.dest);

                // if the current cost < prev cost of traversal
                // from start to this node then we try to update it
                if (dist.get(v.getData()) + edge.cost < dist.get(edge.dest)) {
                    dist.set(edge.dest, dist.get(v.getData()) + edge.cost);
                    prev.set(edge.dest, v.getData());

                    // update changes
                    changes++;
                    edgeAction(edge);
                }
            });
        });
    }
    return [dist, prev];
};

export default bellmanFord;
