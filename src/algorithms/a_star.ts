import {
    AlgorithmApiInputs_t,
    AlgorithmApiReturn_t,
    NOTSET,
    NOTSET_t
} from "../visualise-graphs/ts/Types";
import {MinPriorityQueue} from "@datastructures-js/priority-queue";

/**
 * Internal implementation of the a-star algorithm
 * This algorithm uses EPS [10^-5] and uses multiplication
 * and addition to make an informed choice.
 *
 * @param graph the Graph to use
 * @param start starting node ID
 * @param end ending node ID
 * @returns a distance map, a map to reconstruct the path and a set of visited nodes inorder
 */
const internalAStar = ({
                           graph, startNodeId, endNodeId, nodeAction, edgeAction
                       }: AlgorithmApiInputs_t): [Map<string, number>, Map<string, string>, Set<string>] => {

    // created type to have
    // in the Priority Queue
    type Priority = {

        // UID of node
        label: string,

        // min distance from [S]
        minDist: number,

        // min heuristic cost from [S]
        minHeuristic: number
    };

    // making the priority queue to
    // sort the data in the opening nodes
    // the distance map is for understanding if a path exists or not
    // the visited set is for visualisation
    // and to make decisions about whether a node should be opened or not
    const PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minHeuristic);
    const dist: Map<string, number> = new Map(), prev: Map<string, string> = new Map();
    const visited: Set<string> = new Set();

    // set the distances to infinity
    graph.vertices().forEach((node) => {
        node.getData() !== startNodeId ? dist.set(node.getData(), Infinity) : dist.set(startNodeId,
            0);
    });

    // getting the start and end nodes
    let dest = graph.vertices().get(startNodeId), endNode = graph.vertices().get(endNodeId);

    // Enqueue the first item
    // this way, the PQ is always > 0 when starting.
    PQ.enqueue({
        label: startNodeId, minDist: 0,
        minHeuristic: graph.distBw(dest.coordinates(), endNode.coordinates())
    });

    // keeps going while PQ is not exhausted
    while (!PQ.isEmpty()) {

        // deconstruct the object
        const {label, minDist} = PQ.dequeue();

        // add to visited to say that this node has been opened already
        visited.add(label);

        nodeAction(label);
        // if we see that the current minDist is > the dist present in the Map
        // then it is evident that there is no point in trying to explore it since
        // it may not yield a better path.
        if (dist.get(label) < minDist)
            continue;

        // open all the neighbour nodes
        // same as a bfs search
        // this bfs gives a cyclic kind of effect
        graph.vertices().get(label).getAdjVertices().forEach(edge => {

            // get the data to remove
            // boilerplate code
            let destData = edge.dest;

            // if visited does not have the node
            // then only do we open it.
            // else we can already confirm that all the nodes
            // have either been opened or explored or are going to
            // be explored.
            if (!visited.has(destData)) {

                // get the new dist
                // which is dist form [S] of the prev node
                // + edge cost.
                let newDist = dist.get(label) + edge.cost;

                // get heuristics from the previous node
                // and node to next
                const destNode = graph.vertices().get(destData);
                let newHeuristic = (graph.distBw(destNode.coordinates(), endNode.coordinates(),
                    'e')) / 1000000 * newDist;

                // now if newDist is < dist present in dist Map
                // then only do we update everything
                // else we do not.
                if (newDist < dist.get(destData)) {
                    edgeAction(edge);
                    prev.set(destData, label);
                    dist.set(destData, newDist);
                    PQ.enqueue({label: destData, minDist: newDist, minHeuristic: newHeuristic});
                }
            }
        });

        // if label is end
        // then path has been found
        // we directly return
        if (label === endNodeId) return [dist, prev, visited];
    }

    // right now its confirmed that we have no
    // potential path
    return [dist, prev, visited];
}

/**
 * Classic a-start implementation
 * using heuristics and weights
 *
 * @param graph the Graph to use
 * @param start the starting node ID
 * @param end the ending node ID
 * @returns a path | null [path if found, else null] and a Set of visited nodes inorder
 */
const aStar = ({
                   graph, startNodeId, endNodeId, nodeAction, edgeAction
               }: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {

    // first deconstruct the array returned from a-start
    // dist is the distance from start [S]-> every node [A] which is reachable
    // prev is required to reconstruct path
    // visited is the set of nodes visited in order
    const [dist, prev, visited] = internalAStar(
        {graph, startNodeId, endNodeId, nodeAction, edgeAction});

    // this is just to reconstruct the path for a*;
    let path: string[] = [];

    // if distance is infinity,
    // we automatically understand no path is possible
    // thus, return null
    if (dist.get(endNodeId) === Infinity)
        return [NOTSET, visited];

    // reconstruct path
    // after that just return
    for (let at: string = endNodeId; at !== undefined; at = prev.get(at))
        path.unshift(at);

    // we are sure path exists
    // so we just return it.
    return [path, visited];
}

export default aStar;
