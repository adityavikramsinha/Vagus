import { AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET } from '../visualise-graphs/ts/Types';
import { createHangingInputAbortSignal } from 'next/dist/server/app-render/dynamic-rendering';

/**
 * Classic DFS which uses an internal function to do recursion
 *
 * @param inputs an object of shape {@link AlgorithmApiInputs_t} containing all relevant information
 * @returns {@link AlgorithmApiReturn_t}
 */
const dfs = (inputs: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {
    // path is for the path to be returned
    // visited is for the Set of visited nodes in order
    // prev is to construct a path.
    const path: string[] = [];
    const visited: Set<string> = new Set();
    const prev: Map<string, string> = new Map();

    /**
     * Internal function which recurses again and again,
     * thus helping in DFS.
     * This modifies the parent level variables and hence,
     * has no return
     *
     * @param at the present node id for iteration
     * @param parent
     */
    const internalDfs = (at: string, parent: string): void => {
        inputs.nodeAction(at);
        // First check if visited has this or not
        // because if it does then it means that
        // we have already opened this node and explored
        // it in-depth.
        if (!visited.has(at)) {
            // add the node if not visited
            visited.add(at);

            // setting prev for the path stuff
            prev.set(at, parent);

            // if not found then keep opening
            // descendent
            if (at !== inputs.endNodeId) {
                inputs.graph
                    .vertices()
                    .get(at)
                    .getAdjVertices()
                    .forEach((edge) => {
                        // add to list of visited Edges
                        inputs.edgeAction(edge);
                        internalDfs(edge.dest, at);
                    });
            }

            // if found then we just construct the path
            // and leave
            else {
                for (let at = inputs.endNodeId; at !== undefined; at = prev.get(at))
                    path.unshift(at);
                return;
            }
        }
    };
    internalDfs(inputs.startNodeId, undefined);
    return path.length > 0 ? path : NOTSET;
};
export default dfs;
