import {AlgorithmApiReturn_t, NOTSET} from "../visualise-graphs/ts/Types";
import Graph from "../visualise-graphs/ts/Graph";
import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import Algorithms from "../visualise-graphs/ts/Algorithms";
import Edge from "../visualise-graphs/ts/Edge";
import {Queue} from "queue-typescript";

/**
 * Classic implementation of Dijkstras algorithm
 * which opens the nodes using BFS but is weighted.
 * We can call it a weighted BFS in some context.
 *
 * @param start the id of the starting node
 * @param end the id of the end node
 * @param graph the graph to use for the algorithm
 * @param nodeAction action to perform whenever a node is dequeued from Priority queue
 * @param edgeAction action to perform whenever an edge is opened for a node that is to be put
 * on the PQ.
 * @returns a path | null [path if found, else] and visited inorder Set.
 */
const dijkstras = (graph: Graph, start: string, end: string,
nodeAction:(node:string)=>void = (_)=>{}, edgeAction: (edge:Edge)=>void = (_)=>{}): AlgorithmApiReturn_t => {

    // first get everything from the internal Dijkstra function
    const [dist, prev, visited] = internalDijkstras(graph, start, end, nodeAction, edgeAction);

    // the rest is just finding the path to use.
    let path: string[] = [];

    // if distance is Infinity then,
    // we know path is not found.
    // directly return
    if (dist.get(end) === Infinity)
        return [NOTSET, visited];

    // if it is not null,
    // we know there must be a path that exists
    // so reconstruct it.
    for (let at: string = end; at !== undefined; at = prev.get(at)) path.unshift(at);

    // return reconstructed path.
    return [path, visited];
}

/**
 * Internal implementation of the dijkstras algorithm.
 *
 * @param start the starting node ID
 * @param end the ending node ID
 * @param graph the graph to use
 * @param nodeAction
 * @param edgeAction
 * @returns a dist Map to show the distances between the nodes, a Map which has the prev nodes and, a Set for visited nodes inorder.
 */
const internalDijkstras = (graph: Graph, start: string, end: string,
                           nodeAction:(node:string)=>void = (_)=>{}, edgeAction: (edge:Edge)=>void = (_)=>{}):
    [Map<string, number>, Map<string, string>, Set<string>] => {

    // Creating a type to hold the important
    // properties for the Priority Queue.
    type Priority = {
        info: {
            label: string,
            srcLabel: string
        },
        minDist: number;
    }

    // Priority Queue for total ordering through the
    // minDist property.
    let PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minDist);

    // dist map for shortest distance between
    // a node [A] and the Start node [S]
    let dist: Map<string, number> = new Map(), prev: Map<string, string> = new Map();

    // Set of all visited nodes
    let visited: Set<string> = new Set();

    // First we set the value of distances from node [S]
    // to any node [A] to infinity
    graph.vertices().forEach((node) => {
        node.getData() !== start ? dist.set(node.getData(), Infinity) : dist.set(start, 0);
    });

    // Enqueue the first node,
    // this way we have a length of 1
    // and least distance of 0.
    PQ.enqueue({
        info: {
            label: start, srcLabel: start
        }, minDist: 0
    });

    // While it is not empty,
    // nodes should be dequeued from the
    // PQ.
    while (!PQ.isEmpty()) {

        // get the Priority Object and deconstruct it
        const {
            info: {
                label, srcLabel
            }, minDist
        } = PQ.dequeue();
        // add it to visited so that
        // we do not keep opening it.
        visited.add(label);

        nodeAction(label);

        // if the dist > minDist then
        // we know that we can open it
        // since we get a better route.
        if (dist.get(label) < minDist)
            continue;
        // follow the BFS pattern
        // we open every neighbour
        // and explore it
        // the ordering is based on their min dist
        // hence a priority queue.
        graph.vertices().get(label).getAdjVertices().forEach(edge => {

            // first get the destination node
            const dest = edge.dest;

            // if visited does not have destination
            // then it means that it has not been explored
            // hence there is merit in the fact that it might be
            // helpful to open it.
            if (!visited.has(dest)) {

                // new Dist will be the dist till now + the cost of moving from
                // the prev node to this node
                let newDist = dist.get(label) + edge.cost;

                // if new Dist < the current dist of the destination
                // then we add
                // this is bound to hit every node once
                // since starting value in distance for every node is
                // infinity.
                if (newDist < dist.get(dest)) {

                    // we reference this node in case it is a part of the
                    // path
                    prev.set(dest, label);

                    // update the distance from [S] to this node [A]
                    dist.set(dest, newDist);

                    // enqueue this for opening in terms of minDist.
                    PQ.enqueue({
                        info: {
                            label: dest,
                            srcLabel: label
                        }, minDist: newDist
                    });
                    edgeAction(edge);
                }
            }
        });

        // if label is the same as end
        // then we know that, there is a path
        // and return all the items for reconstruction.
        if (label === end) return [dist, prev, visited];
    }

    // at this point, the end dist is Infinity
    // thus we know that it has not been relaxed
    // hence, we need to go about and just return everything to caller
    // the caller has the ability to understand if
    // the given end dist is Infinity or not.
    return [dist, prev, visited];
}

export default dijkstras;
