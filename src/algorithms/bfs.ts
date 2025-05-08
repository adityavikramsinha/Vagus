import { AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET } from '../visualise-graphs/ts/Types';
import { Queue } from 'queue-typescript';

/**
 * Implementation of the Breadth first Search
 *
 * @param graph the Graph to use
 * @param startNodeId starting node ID
 * @param endNodeId ending node ID
 * @param nodeAction action to perform on every node dequeue (to preserve the order in Queue)
 * @param edgeAction action to perform whenever a new destination from an opened nodes' edge is
 * added.
 * @returns {@link AlgorithmApiReturn_t}
 */
const bfs = ({
    graph,
    startNodeId,
    endNodeId,
    nodeAction,
    edgeAction,
}: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {
    // first initialise all the variables
    // visited is the nodes that are visited in the process
    // prev is to keep track of the path is the actual path
    // Q is a queue which performs the FIFO operation
    const visited: Set<string> = new Set();
    const prev: Map<string, string> = new Map();
    const path: string[] = [];
    const Q = new Queue<string>();

    Q.enqueue(startNodeId);

    while (Q.length !== 0) {
        const node = graph.vertices().get(Q.dequeue());

        // then we add that node to visited set.
        visited.add(node.getData());

        // perform the node action
        nodeAction(node.getData());

        // if the nodes data is the same as end id,
        // we know we have reached a path
        // therefore we just give it out as is and
        // stop the function
        if (node.getData() === endNodeId) {
            // construct the path
            for (let at = endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);

            // return path and visited inorder
            return path;
        }

        // if end has not been found
        // we keep going over all the neighbours of this noe
        // in order
        // this is the reason it is called breadth-first-search
        // we keep opening all the neighbours, gives the search
        // a cyclic effect.
        node.getAdjVertices().forEach((edge) => {
            // perform edge action
            edgeAction(edge);
            const destId = edge.dest;
            if (!visited.has(destId)) {
                // added it to visited set.
                visited.add(destId);

                // set prev
                prev.set(destId, node.getData());

                // add it to the queue since this means that
                // we have to open this node again sometime later.
                Q.enqueue(destId);
            }
        });
    }
    return NOTSET;
};
export default bfs;
