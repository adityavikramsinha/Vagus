import Graph from "../Graph";
import {NOTSET, NOTSET_t} from "../Types";
import dijkstras from "./dijkstras_algorithm";

/**
 * Starts a weighted , bidirectional ,dijkstras search
 * to find a path
 *
 * @param start the starting node ID
 * @param end target/end node ID
 * @param graph The Graph to use
 * @returns a path | null [path if present, else null] and two sets, first is of a search
 * from the Start till some point X and second is from the end till the same point X where
 * both of these algorithms meet.
 */
const biDirectional=(graph: Graph, start: string, end: string): [string[] | NOTSET_t, Set<string>, Set<string>]=>{

    const pathFromStart = dijkstras(graph, start, end)[0];

    // if it is null , we automatically know
    // the there is no path possible
    if (pathFromStart === NOTSET) {

        // we just get visited from start and visited from end Sets
        let visitedFromStart = dijkstras(graph, start, end)[1];
        let visitedFromEnd = dijkstras(graph, end, start)[1];

        // we return the path from start [or null] and the two sets as promised.
        return [NOTSET, visitedFromStart, visitedFromEnd];
    }

    // else, we splice the path
    // at mid-point >> 1
    // also we can 100% confirm that it is not NOT_SET
    let spliceNode: string = pathFromStart[(pathFromStart as string[]).length >> 1];

    // we get from this splice point a visited from start
    // and a visited from end
    let visitedFromStart = dijkstras(graph, start, spliceNode)[1];
    let visitedFromEnd = dijkstras(graph, end, spliceNode)[1];

    // then we return the whole thing as promised.
    return [pathFromStart, visitedFromStart, visitedFromEnd];
}

export default biDirectional;
