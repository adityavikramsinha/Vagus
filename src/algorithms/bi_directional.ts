import { AlgorithmApiInputs_t, NOTSET, NOTSET_t } from '../visualise-graphs/ts/Types';
import dijkstras from './dijkstras_algorithm';

/**
 * Starts a weighted , bidirectional ,dijkstras search
 * to find a path
 *
 * @param graph the Graph to use
 * @param startNodeId starting node ID
 * @param endNodeId ending node ID
 * @param nodeAction action to perform on every node dequeue (to preserve the order in Priority
 * Queue)
 * @param edgeAction action to perform whenever a new destination from an opened nodes' edge is
 * added.
 * @returns a path or {@link NOTSET_t} and two sets, first is of a search
 * from the Start till some point X and second is from the end till the same point X where
 * both of these algorithms meet.
 */
const biDirectional = ({
    graph,
    startNodeId,
    endNodeId,
    nodeAction,
    edgeAction,
}: AlgorithmApiInputs_t): [string[] | NOTSET_t, Set<string>, Set<string>] => {
    const pathFromStart = dijkstras({ graph, startNodeId, endNodeId, nodeAction, edgeAction });

    const visitedFromStart = new Set<string>();
    const visitedFromEnd = new Set<string>();

    // if it is NOTSET , we automatically know
    // the there is no path possible
    if (pathFromStart === NOTSET) {
        // we just get visited from start and visited from end Sets
        dijkstras({
            graph,
            startNodeId,
            endNodeId,
            nodeAction: (nodeId) => {
                visitedFromStart.add(nodeId);
            },
            edgeAction,
        });
        dijkstras({
            graph,
            startNodeId: endNodeId,
            endNodeId: startNodeId,
            nodeAction: (nodeId) => {
                visitedFromEnd.add(nodeId);
            },
            edgeAction,
        });
        return [NOTSET, visitedFromStart, visitedFromEnd];
    }

    // else, we splice the path
    // at mid-point >> 1
    // also we can 100% confirm that it is not NOT_SET
    const spliceNode: string = pathFromStart[(pathFromStart as string[]).length >> 1];

    // we get from this splice point a visited from start
    // and a visited from end
    dijkstras({
        graph,
        startNodeId,
        endNodeId: spliceNode,
        nodeAction: (nodeId) => {
            visitedFromStart.add(nodeId);
        },
        edgeAction,
    });
    dijkstras({
        graph,
        startNodeId: endNodeId,
        endNodeId: spliceNode,
        nodeAction: (nodeId) => {
            visitedFromEnd.add(nodeId);
        },
        edgeAction,
    });
    return [pathFromStart, visitedFromStart, visitedFromEnd];
};

export default biDirectional;
