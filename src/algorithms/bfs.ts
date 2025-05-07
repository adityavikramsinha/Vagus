import {NOTSET, NOTSET_t} from "../visualise-graphs/ts/Types";
import {Queue} from "queue-typescript";
import Algorithms from "../visualise-graphs/ts/Algorithms";
import Graph from "../visualise-graphs/ts/Graph";

/**
 * Classic Breadth-first search algorithm which
 * is unweighted.
 *
 * @param start the starting ID on the graph
 * @param end the end ID on the graph
 * @param graph the Graph to use.
 * @returns an array containing the path | null [path is given if it is found, else null] and a Set of
 * visited nodes inorder while trying to find the path.
 */
const bfs = (graph: Graph, start: string, end: string): [string[] | NOTSET_t, Set<string>, Map<string, Set<string>>] => {

    // first initialise all the variables
    // visited is the nodes that are visited in the process
    // prev is to keep track of the
    // path is the actual path
    // visitedEdges keeps a track of the edges that were visited.
    // Q is a queue which performs the FIFO operation
    const visited: Set<string> = new Set();
    const prev: Map<string, string> = new Map();
    const path: string[] = [];
    const visitedEdges: Map<string, Set<string>> = new Map();
    const Q = new Queue<string>();

    // Enqueue the first one
    Q.enqueue(start);

    // While the length of the Queue is not 0
    // We keep on going.
    while (Q.length !== 0) {

        // We first get the present node instance from the graph.
        let node = graph.vertices().get(Q.dequeue());

        // then we add that node to visited set.
        visited.add(node.getData());

        // if the nodes data is the same as end id,
        // we know we have reached a path
        // therefore we just give it out as is and
        // stop the function
        if (node.getData() === end) {

            // construct the path
            for (let at = end; at !== undefined; at = prev.get(at))
                path.unshift(at);

            // return path and visited inorder
            return [path, visited, visitedEdges];
        }

        // if end has not been found
        // we keep going over all the neighbours of this noe
        // in order
        // this is the reason it is called breadth-first-search
        // we keep opening all the neighbours, gives the search
        // a cyclic effect.
        node.getAdjVertices().forEach(edge => {
            // if we have already visited it, we do not need to
            // because it means that it is already added to the visited section
            // and was a part of the queue.
            const destId = edge.dest;
            if (!visited.has(destId)) {

                // added it to visited set.
                visited.add(destId);

                // set prev
                prev.set(destId, node.getData());

                // add it to the queue since this means that
                // we have to open this node again sometime later.
                Q.enqueue(destId);
                Algorithms.addVisitedEdge(visitedEdges, node.getData(), destId);
            }
        });
    }

    // if the code has reached here then
    // we can safely assume that end was not a
    // neighbour of any node
    // thus, no path should exist
    // hence, we return null and just visited set
    return [NOTSET, visited, visitedEdges];
}
export default bfs;
