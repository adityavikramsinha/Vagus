import { AlgorithmApiInputs_t, AlgoType, NOTSET, NOTSET_t } from '../ts/Types';
import { match } from 'ts-pattern';
import bfs from '../../algorithms/bfs';
import dfs from '../../algorithms/dfs';
import dijkstras from '../../algorithms/dijkstras_algorithm';
import bestFirstSearch from '../../algorithms/best_first_search';
import bellmanFord from '../../algorithms/bellman_ford';
import aStar from '../../algorithms/a_star';
import bfs0_1 from '../../algorithms/bfs0_1';
import Graph from '../ts/Graph';

/**
 * Main backbone of the whole backend.
 * This class contains the various algorithms which are required to
 * give their outputs to visualise.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export default class AlgorithmRunner {
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
    static runWithoutBombNode(
        algoType: AlgoType,
        startNodeId: string,
        endNodeId: string,
        graph: Graph,
    ): {
        path: string[] | NOTSET_t;
        visited: Set<string>;
    } {
        const visited = new Set<string>();
        const inputs: AlgorithmApiInputs_t = {
            graph,
            startNodeId,
            endNodeId,
            edgeAction: (_) => {},
            nodeAction: (nodeId) => {
                visited.add(nodeId);
            },
        };
        // using if else and enums to return an output in the form of [path , visitedInOrder] which
        // is later turned directly into an object and given as return from the function
        const path: string[] | NOTSET_t = match(algoType)
            .with(AlgoType.ZERO_ONE_BREADTH_FIRST_SEARCH, () => bfs0_1(inputs))
            .with(AlgoType.DIJKSTRAS_SEARCH, () => dijkstras(inputs))
            .with(AlgoType.A_STAR_SEARCH, () => aStar(inputs))
            .with(AlgoType.BREADTH_FIRST_SEARCH, () => bfs(inputs))
            .with(AlgoType.DEPTH_FIRST_SEARCH, () => dfs(inputs))
            .with(AlgoType.BELLMAN_FORD, () => bellmanFord(inputs))
            .with(AlgoType.BEST_FIRST_SEARCH, () => bestFirstSearch(inputs))
            .otherwise(() => NOTSET);

        return { path, visited };
    }

    private static joinBombNodePath(p1: string[] | NOTSET_t, p2: string[] | NOTSET_t) {
        return p1 !== NOTSET && p2 !== NOTSET ? p1.concat(p2.slice(1)) : NOTSET;
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
        graph: Graph,
    ): { path: string[] | NOTSET_t; visitedP1: Set<string>; visitedP2: Set<string> } {
        const visitedP1 = new Set<string>();
        const visitedP2 = new Set<string>();
        const inputsTillBombNode: AlgorithmApiInputs_t = {
            graph,
            startNodeId,
            endNodeId: bombNodeId,
            edgeAction: (_) => {},
            nodeAction: (nodeId) => {
                visitedP1.add(nodeId);
            },
        };
        const inputsTillEndNode: AlgorithmApiInputs_t = {
            graph,
            startNodeId: bombNodeId,
            endNodeId,
            edgeAction: (_) => {},
            nodeAction: (nodeId) => {
                visitedP2.add(nodeId);
            },
        };

        const path: NOTSET_t | string[] = match(algoType)
            .with(AlgoType.A_STAR_SEARCH, () =>
                AlgorithmRunner.joinBombNodePath(
                    aStar(inputsTillBombNode),
                    aStar(inputsTillEndNode),
                ),
            )
            .with(AlgoType.BREADTH_FIRST_SEARCH, () =>
                AlgorithmRunner.joinBombNodePath(bfs(inputsTillBombNode), bfs(inputsTillEndNode)),
            )
            .with(AlgoType.BELLMAN_FORD, () =>
                AlgorithmRunner.joinBombNodePath(
                    bellmanFord(inputsTillBombNode),
                    bellmanFord(inputsTillEndNode),
                ),
            )
            .with(AlgoType.DIJKSTRAS_SEARCH, () =>
                AlgorithmRunner.joinBombNodePath(
                    dijkstras(inputsTillBombNode),
                    dijkstras(inputsTillEndNode),
                ),
            )
            .with(AlgoType.DEPTH_FIRST_SEARCH, () =>
                AlgorithmRunner.joinBombNodePath(dfs(inputsTillBombNode), dfs(inputsTillEndNode)),
            )
            .with(AlgoType.BEST_FIRST_SEARCH, () =>
                AlgorithmRunner.joinBombNodePath(
                    bestFirstSearch(inputsTillBombNode),
                    bestFirstSearch(inputsTillEndNode),
                ),
            )
            .otherwise(() => NOTSET);

        return { path, visitedP1, visitedP2 };
    }
}
