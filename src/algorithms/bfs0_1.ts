import {Queue} from "queue-typescript";
import {AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET} from "../visualise-graphs/ts/Types";

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

const internalBfs0_1 = ({
                            graph, startNodeId, endNodeId, nodeAction, edgeAction
                        }: AlgorithmApiInputs_t)
    : [Map<string, number>, Map<string, string>] => {

    // set of visited nodes IN_ORDER
    // has a Queue of visited Edges (more efficient)
    // map of node -> src to reconstruct path
    // Priority Queue is more of a Doubly Ended Queue.
    // We can use two Queues one for "lower priority" (0) weight.
    // one for "higher priority" (1) weight.
    const visited = new Set<string>();
    const prev = new Map<string, string>();
    // Dist for vertices
    const dist = new Map<string, number>();

    // This acts as a dummy Priority Queue by doing using
    // a Double Queue.
    const PQ = new DoubleQ();

    graph.vertices().forEach(node => {
        node.getData() !== startNodeId ? dist.set(node.getData(), Infinity) : dist.set(
            node.getData(), 0);
    });
    PQ.enqueue({label: {from: startNodeId, to: startNodeId}, wt: 0}, 0);

    while (!PQ.isEmpty()) {
        const {label, wt} = PQ.dequeue();
        nodeAction(label.to);
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
                    edgeAction(edge);
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
        if (label.to === endNodeId)
            return [dist, prev]
    }

    // return all data from API.
    return [dist, prev]
}

/**
 * Implementation of the 0-1 special case for Breadth-First-Search.
 * See {@link https://cp-algorithms.com/graph/01_bfs.html} for proof of concept and logic.
 * @param graph the graph to use
 * @param start start vertex
 * @param end end vertex
 */
const bfs0_1 = ({graph, startNodeId, endNodeId, nodeAction, edgeAction}: AlgorithmApiInputs_t)
    : AlgorithmApiReturn_t => {

    // first get everything from the internal Dijkstra function
    const [dist, prev] = internalBfs0_1(
        {graph, startNodeId, endNodeId, nodeAction, edgeAction});

    // the rest is just finding the path to use.
    let path: string[] = [];

    // if distance is Infinity then,
    // we know path is not found.
    // directly return
    if (dist.get(endNodeId) === Infinity)
        return NOTSET;

    // if it is not null,
    // we know there must be a path that exists
    // so reconstruct it.
    for (let at: string = endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);

    // return reconstructed path.
    return path;
}

export default bfs0_1;
