import {AlgoType, NOTSET, NOTSET_t} from "./Types";
import BackendStateManager from "../api/BackendStateManager";
import {match} from "ts-pattern";
import bfs from "../../algorithms/bfs"
import dfs from '../../algorithms/dfs';
import dijkstras from "../../algorithms/dijkstras_algorithm";
import bestFirstSearch from "../../algorithms/best_first_search";
import bellmanFord from "../../algorithms/bellman_ford";
import aStar from "../../algorithms/a_star";

/**
 * Main backbone of the whole backend.
 * This class contains the various algorithms which are required to
 * give their outputs to visualise.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export default class Algorithms {


    /**
     * Private utility function to add an edge to a visited set
     * @param visitedEdges set of visited edges
     * @param from the source vertex/node
     * @param to destination vertex/node
     * @private
     */
    static addVisitedEdge(visitedEdges: Map<string, Set<string>>, from: string, to: string) {
        if (!visitedEdges.has(from)) {
            visitedEdges.set(from, new Set());
        }
        visitedEdges.get(from)!.add(to);
    }

    /**
     * Is a helper function on required for this project
     * It helps simplify front end by doing everything internally
     * It returns the relevant algorithm [ @see AlgoType ] for the startNode and endNode from global state
     * but without bomb. Does not take care of random walk or bidirectional algorithm.
     *
     * @param algoType the type of algorithm to return.
     * @param startNodeId start node ID
     * @param endNodeId end node ID
     * @param graph the graph to use in the algorithms.
     * @returns an object containing the path and visitedInOrder properties.
     * the path contains the path from start->end for currentState and visitedInOrder contains
     * the nodes that were visited [inorder] to reach to that path
     */
    static runWithoutBombNode(algoType: AlgoType, startNodeId: string, endNodeId: string, graph = BackendStateManager.graph()): {
        path: string[] | NOTSET_t,
        visited: Set<string>,
        visitedEdges: Map<string, Set<string>>
    } {
        // using if else and enums to return an output in the form of [path , visitedInOrder] which
        // is later turned directly into an object and given as return from the function
        const [path, visited, visitedEdges] = match(algoType)
            .with(AlgoType.DIJKSTRAS_SEARCH, () => dijkstras(graph, startNodeId, endNodeId))
            .with(AlgoType.A_STAR_SEARCH, () => aStar(graph, startNodeId, endNodeId))
            .with(AlgoType.BREADTH_FIRST_SEARCH, () => bfs(graph, startNodeId, endNodeId))
            .with(AlgoType.DEPTH_FIRST_SEARCH, () => dfs(graph, startNodeId, endNodeId))
            .with(AlgoType.BELLMAN_FORD, () => bellmanFord(graph, startNodeId, endNodeId))
            .with(AlgoType.BEST_FIRST_SEARCH, () => bestFirstSearch(graph, startNodeId, endNodeId))
            .otherwise(() => [NOTSET, NOTSET]);
        // @ts-ignore
        return {path, visited, visitedEdges}
    }

    /**
     * Static function to help out in getting the output when bomb is being used on the website
     * Gets all the algorithms together and helps maintain a level of anonymity and cleanliness.
     *
     * @returns an object containing the path | null [depending on if it is found], and two Sets [one for visited
     * from start -> bomb and the other for bomb->end]
     */
    static runWithBombNode(
        algoType: AlgoType,
        startNodeId: string,
        endNodeId: string,
        bombNodeId: string,
        graph = BackendStateManager.graph()
    ): { path: string[] | NOTSET_t, visitedP1: Set<string>, visitedP2: Set<string> } {
        // @ts-ignore
        return match(algoType)
            .with(AlgoType.A_STAR_SEARCH, () => {
                const [pathP1, visitedP1] = aStar(graph, startNodeId, bombNodeId);
                const [pathP2, visitedP2] = aStar(graph, bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .with(AlgoType.BREADTH_FIRST_SEARCH, () => {
                const [pathP1, visitedP1] = bfs(graph, startNodeId, bombNodeId);
                const [pathP2, visitedP2] = bfs(graph, bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .with(AlgoType.BELLMAN_FORD, () => {
                const [pathP1, visitedP1] = bellmanFord(graph, startNodeId, bombNodeId);
                const [pathP2, visitedP2] = bellmanFord(graph, bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .with(AlgoType.DIJKSTRAS_SEARCH, () => {
                const [pathP1, visitedP1] = dijkstras(graph, startNodeId, bombNodeId);
                const [pathP2, visitedP2] = dijkstras(graph, bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .with(AlgoType.DEPTH_FIRST_SEARCH, () => {
                const [pathP1, visitedP1] = dfs(graph, startNodeId, bombNodeId);
                const [pathP2, visitedP2] = dfs(graph, bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .with(AlgoType.BEST_FIRST_SEARCH, () => {
                const [pathP1, visitedP1] = bestFirstSearch(graph, startNodeId, bombNodeId);
                const [pathP2, visitedP2] = bestFirstSearch(graph, bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .otherwise(() => {
                console.error(
                    "Internal error, the algorithm selected does not match with the algorithms possible");
                return {
                    path: NOTSET as NOTSET_t, visitedP1: new Set<string>(),
                    visitedP2: new Set<string>()
                };
            });
    }
}
