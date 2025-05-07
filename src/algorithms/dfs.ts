import {AlgorithmApiInputs_t, AlgorithmApiReturn_t, NOTSET} from "../visualise-graphs/ts/Types";

/**
 * Classic DFS which uses an internal function
 * to do recursion
 *
 * @param start starting id of the path
 * @param end ending id of the path
 * @param graph Graph to use.
 * @returns a path | null [path if found, else null] and an inorder Set of visited nodes.
 */
const dfs = ({
                 graph, startNodeId, endNodeId, nodeAction, edgeAction
             }: AlgorithmApiInputs_t): AlgorithmApiReturn_t => {

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
        nodeAction(at);
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
            if (at !== endNodeId) {
                graph.vertices().get(at).getAdjVertices().forEach(edge => {
                    // add to list of visited Edges
                    edgeAction(edge);
                    internalDfs(edge.dest, at);
                });
            }

                // if found then we just construct the path
            // and leave
            else {
                // reconstruct path from the given prev Set
                for (let at = endNodeId; at !== undefined; at = prev.get(at))
                    path.unshift(at);
                return;
            }
        }
    }

    // call function once to start
    // with undefined as starts' "ancestor"
    // this may help in reconstructing path
    internalDfs(startNodeId, undefined);

    // just do a simple ternary
    // to check for length
    // if length ge 1, we know that there is a route
    // else not
    return [(path.length > 0 ? path : NOTSET)];
}
export default dfs;
