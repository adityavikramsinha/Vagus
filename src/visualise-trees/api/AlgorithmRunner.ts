import { AlgorithmApiInputs_t, AlgoType, NOTSET } from '../../visualise-graphs/ts/Types';
import { AnimationSequence, AnimationType } from './Animator';
import { match } from 'ts-pattern';
import bfs0_1 from '../../algorithms/bfs0_1';
import dijkstras from '../../algorithms/dijkstras_algorithm';
import bfs from '../../algorithms/bfs';
import dfs from '../../algorithms/dfs';
import bellmanFord from '../../algorithms/bellman_ford';
import Graph from '../../visualise-graphs/ts/Graph';
import { Queue } from 'queue-typescript';

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
     * @param graph the Graph to use
     * @returns an object containing the path and visitedInOrder properties.
     * the path contains the path from start->end for currentState and visitedInOrder contains
     * the nodes that were visited [inorder] to reach to that path
     */
    static run(
        algoType: AlgoType,
        startNodeId: string,
        endNodeId: string,
        graph: Graph,
    ): {
        scene: Queue<AnimationSequence>;
    } {
        const scene: Queue<AnimationSequence> = new Queue();
        const inputs: AlgorithmApiInputs_t = {
            graph,
            startNodeId,
            endNodeId,
            edgeAction: (edge) => {
                scene.enqueue({
                    type: AnimationType.VISIT_EDGE,
                    payload: edge,
                });
            },
            nodeAction: (nodeId) => {
                scene.enqueue({
                    type: AnimationType.VISIT_NODE,
                    payload: nodeId,
                });
            },
        };
        // using if else and enums to return an output in the form of [path , visitedInOrder] which
        // is later turned directly into an object and given as return from the function
        match(algoType)
            .with(AlgoType.ZERO_ONE_BREADTH_FIRST_SEARCH, () => bfs0_1(inputs))
            .with(AlgoType.DIJKSTRAS_SEARCH, () => dijkstras(inputs))
            // .with(AlgoType.A_STAR_SEARCH, () => aStar(inputs))
            .with(AlgoType.BREADTH_FIRST_SEARCH, () => bfs(inputs))
            .with(AlgoType.DEPTH_FIRST_SEARCH, () => dfs(inputs))
            .with(AlgoType.BELLMAN_FORD, () => bellmanFord(inputs))
            // .with(AlgoType.BEST_FIRST_SEARCH, () => bestFirstSearch(inputs))
            .otherwise(() => [NOTSET, NOTSET]);
        return { scene: scene };
    }
}
