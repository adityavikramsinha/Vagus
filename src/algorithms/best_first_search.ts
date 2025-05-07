import {NOTSET, NOTSET_t} from "../visualise-graphs/ts/Types";
import Graph from "../visualise-graphs/ts/Graph";
import {MinPriorityQueue} from "@datastructures-js/priority-queue";

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
const bestFirstSearch = (graph: Graph, start: string, end: string): [string[] | NOTSET_t, Set<string>] => {

    // first get all the internal information from the implementation
    // prev is for path deconstruction and ,
    // visited in order is for
    // visualisation
    let [prev, visited] = internalBestFirstSearch(graph, start, end);

    // if prev is null then we know that
    // there is no path
    if (prev === NOTSET)
        return [NOTSET, visited];

    // path array
    let path: string[] = [];

    // reconstruct path
    for (let at = end; at !== undefined; at = prev.get(at))
        path.unshift(at);

    // return the path since it exists.
    return [path, visited];
}
/**
 * Implementation of best first search greedy mechanism
 *
 * @param graph theGraph to use
 * @param start starting node id
 * @param end ending node id
 * @returns a Map for path reconstruction and a Set of visited nodes inorder
 */
const internalBestFirstSearch = (graph: Graph, start: string, end: string): [Map<string, string> | NOTSET_t, Set<string>] => {

    // creating a type
    // for priority queue
    // and other sorting
    type Priority = {

        // name of the node or its ID
        label: string,

        // min heuristic cost to end node [end]
        minHeuristic: number
    }

    // Getting a priority queue for ordering of nodes.
    let PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minHeuristic);

    // prev is to reconstruct path
    let prev: Map<string, string> = new Map();

    // visited is for remembering which nodes
    // have been visited
    let visited: Set<string> = new Set();

    // start and end nodes have been given values
    let dest = graph.vertices().get(start), endNode = graph.vertices().get(end);

    // we enqueue the starting node
    PQ.enqueue({label: start, minHeuristic: graph.distBw(dest, endNode)});

    // while PQ is not empty
    // we keep running till we have
    // exhausted all the possible
    // expandable nodes
    while (!PQ.isEmpty()) {

        // get the ID of the node
        const {label} = PQ.dequeue();

        // add it to visited since it has been explored now
        visited.add(label);

        // get ready to explore all the edges going out of it
        graph.vertices().get(label).getAdjVertices().forEach(edge => {

            // getting the data or id of the destination nodes
            let destData = edge.dest.getData();

            // if visited does not have those nodes
            // it means there is a possibility of a better path
            // hence we should enqueue them
            if (!visited.has(destData)) {

                // we get a new heuristic approach
                let newHeuristic = graph.distBw(edge.dest, endNode);

                // we enqueue and then set the nodes as required
                PQ.enqueue({label: destData, minHeuristic: newHeuristic});
                prev.set(destData, label);
            }
        });

        // if the id or label is end
        // then there has to be a path
        // hence we return prev and visited
        if (label === end) return [prev, visited];
    }

    // if till here also the function has come
    // that means end is not reachable
    // hence we return null and visited
    // to signify no path
    return [NOTSET, visited];
}

export default bestFirstSearch;
