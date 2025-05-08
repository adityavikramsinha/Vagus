import { NOTSET, NOTSET_t } from '../../visualise-graphs/ts/Types';

/**
 * Re-constructs a path from the input Map containing node -> src or vertex -> src
 * @param prev map for reconstruction
 * @param condition which when met, will lead to path reconstruction.
 * @param endNodeId is the id of the end node
 *
 */
const reconstruct_path_or_else = (
    prev: Map<string, string>,
    condition: boolean,
    endNodeId: string,
): NOTSET_t | string[] => {
    if (!condition) return NOTSET;
    const path: string[] = [];
    for (let at: string = endNodeId; at !== undefined; at = prev.get(at)) path.unshift(at);
    return path;
};

export default reconstruct_path_or_else;
