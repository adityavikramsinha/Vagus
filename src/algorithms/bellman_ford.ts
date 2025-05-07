import {AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET} from "../visualise-graphs/ts/Types";

/**
 * Classic bellman ford to find negative cycles
 * and for shortest path node relaxation
 *
 * @param graph the Graph to use
 * @param start starting ID
 * @param end ending ID
 * @returns a path | null [path if found, else null] and a Set of visited nodes inorder
 */
const bellmanFord = ({
                         graph, startNodeId, endNodeId, nodeAction, edgeAction
                     }: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {

    // First get all the data from internal bellman ford
    // we get dist to understand if last node [end] was relaxed or not
    // if it was then we can construct a path
    // else we return null since that means there is not a single path
    const [dist, prev, visited] = internalBellmanFord(
        {graph, startNodeId, endNodeId, nodeAction, edgeAction});

    // path array
    let path: string[] = [];

    // checking for if the last node [end] was relaxed or not
    if (dist.get(endNodeId) === Infinity)
        return [NOTSET, visited];

    // path reconstruction
    for (let at = endNodeId; at !== undefined; at = prev.get(at))
        path.unshift(at);

    // return path
    // which is guaranteed to be the shortest path
    // in the graph from start->end.
    return [path, visited];
}

/**
 *
 * @param graph the Graph to use
 * @param start starting node of the path to be found
 * @returns a Map of relaxed distances from start node [S] to all other nodes
 * a Map of previous nodes to construct a path and,
 * a Set of visited nodes.
 */
const internalBellmanFord = ({
                                 graph, startNodeId, endNodeId, nodeAction, edgeAction
                             }: AlgorithmApiInputs_t): [Map<string, number>, Map<string, string>, Set<string>] => {

    // dist is for the possibility of relaxation
    // this also signifies if a path from the start -> end
    // exists since if end is not relaxed [i.e. end remains Infinity]
    // it means it is unreachable
    let dist: Map<string, number> = new Map();


    // Set of visited nodes inorder
    let visited: Set<string> = new Set();
    // Map to help in path reconstruction
    let prev: Map<string, string> = new Map();

    // Set all the dist to Infinity
    // minus the start node
    graph.vertices().forEach((node) => {
        node.getData() !== startNodeId ? dist.set(node.getData(), Infinity) : dist.set(startNodeId, 0);
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

        changes = 0
        // each time we go through each node of the graph
        graph.vertices().forEach((node) => {

            // and each edge in the graph from this node
            // we open it up and try to see if
            // relaxation is possible or not
            node.getAdjVertices().forEach(edge => {

                // if visited does not have the node
                // we simply add it.
                if (!visited.has(edge.dest))
                    visited.add(edge.dest);

                // if the current cost < prev cost of traversal
                // from start to this node
                // then we try to
                // update it
                if (dist.get(node.getData()) + edge.cost < dist.get(edge.dest)) {

                    // update its new best distance
                    dist.set(edge.dest, dist.get(node.getData()) + edge.cost);

                    // set it as a possible path candidate
                    prev.set(edge.dest, node.getData());

                    // update changes
                    changes++;
                    nodeAction(node.getData());
                    edgeAction(edge);
                }
            })
        })
    }

    // return everything that was promised.
    return [dist, prev, visited];
}

export default bellmanFord;
