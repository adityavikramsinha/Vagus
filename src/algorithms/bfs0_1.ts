import Graph from "../visualise-graphs/ts/Graph";
import {Queue} from "queue-typescript";
import Edge from "../visualise-graphs/ts/Edge";
import Algorithms from "../visualise-graphs/ts/Algorithms";
import {NOTSET, NOTSET_t} from "../visualise-graphs/ts/Types";

type DQ_t = {
    label: {
        from: string,
        to: string
    },
    wt: number
}

/**
 * Double Q is just an implementation of two queues with a priority.
 * It is internal to this file.
 */
class DoubleQ {
    q_0: Queue<DQ_t> = new Queue();
    q_1: Queue<DQ_t> = new Queue();

    /**
     * Just make two new queues
     */
    constructor() {
    }

    /**
     * Enqueue data with weight EITHER 0 or 1
     * @param data Data to put into the Double Queue
     * @param parity parity of 0 or 1
     */
    enqueue(data: DQ_t, parity: number) {
        if (parity !== 0 && parity !== 1)
            throw new Error(`Cannot enqueue with weight ${data.wt}, only 0 or 1 allowed`);
        // First check if it is ODD or EVEN.
        (parity & 1) === 1 ? this.q_1.enqueue(data) : this.q_0.enqueue(data);
    }

    /**
     * Dequeues' from the DoubleQ, ensures that on priority, all queue elements
     * with in-priority of 0 (based on parity while enqueue-ing) are flushed before the 1.
     */
    dequeue() {
        return this.q_0.length > 0 ? this.q_0.dequeue() : this.q_1.dequeue();

    }

    /**
     * Returns the size of the underlying Data Structure.
     */
    isEmpty() {
        return this.q_0.length + this.q_1.length === 0;
    }
}

const internalBfs0_1 = (graph: Graph, start: string, end: string)
    : [Map<string, number>, Map<string, string>, Set<string>, Edge[]] => {

    // set of visited nodes IN_ORDER
    // has a Queue of visited Edges (more efficient)
    // map of node -> src to reconstruct path
    // Priority Queue is more of a Doubly Ended Queue.
    // We can use two Queues one for "lower priority" (0) weight.
    // one for "higher priority" (1) weight.
    const visited = new Set<string>();
    const visitedEdges = new Queue<Edge>();
    const prev = new Map<string, string>();
    // Dist for vertices
    const dist = new Map<string, number>();

    // This acts as a dummy Priority Queue by doing using
    // a Double Queue.
    const PQ = new DoubleQ();

    graph.vertices().forEach(node => {
        node.getData() !== start ? dist.set(node.getData(), Infinity) : dist.set(node.getData(), 0);
    });
    PQ.enqueue({label: {from: start, to: start}, wt: 0}, 0);

    while (!PQ.isEmpty()) {
        const {label, wt} = PQ.dequeue();
        Algorithms.addVisitedEdge(visitedEdges, label.from, label.to);
        visited.add(label.to);

        // if the current dist for this node is < the weight,
        // then there is no point in "opening" this node for relaxation
        if (dist.get(label.to) < wt)
            continue;
        graph.vertices().get(label.to).getAdjVertices().forEach(edge => {
            const dest = edge.dest;
            if (!visited.has(dest)) {
                let newDist = edge.cost + wt;
                if (newDist < dist.get(dest)) {
                    prev.set(dest, label.to);
                    dist.set(dest, newDist);
                    PQ.enqueue({
                        label: {
                            to: dest,
                            from: label.to
                        }, wt: newDist
                    }, edge.cost)
                }
            }
        });

        // premature return if we find the end
        if (label.to === end)
            return [dist, prev, visited, visitedEdges.toArray()]
    }

    // return all data from API.
    return [dist, prev, visited, visitedEdges.toArray()]
}

/**
 * Implementation of the 0-1 special case for Breadth-First-Search.
 * See {@link https://cp-algorithms.com/graph/01_bfs.html} for proof of concept and logic.
 * @param graph the graph to use
 * @param start start vertex
 * @param end end vertex
 */
const bfs0_1 = (graph: Graph, start: string, end: string)
    : [string[] | NOTSET_t, Set<string>, Edge[]] => {

    // first get everything from the internal Dijkstra function
    const [dist, prev, visited, visitedEdges] = internalBfs0_1(graph, start, end);

    // the rest is just finding the path to use.
    let path: string[] = [];

    // if distance is Infinity then,
    // we know path is not found.
    // directly return
    if (dist.get(end) === Infinity)
        return [NOTSET, visited, visitedEdges];

    // if it is not null,
    // we know there must be a path that exists
    // so reconstruct it.
    for (let at: string = end; at !== undefined; at = prev.get(at)) path.unshift(at);

    // return reconstructed path.
    return [path, visited, visitedEdges];
}

export default bfs0_1;
