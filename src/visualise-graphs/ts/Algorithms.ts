import Graph from './Graph';
import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import {AlgoType, NOTSET, NOTSET_t} from "./Types";
import BackendStateManager from "../api/BackendStateManager";
import {match} from "ts-pattern";
import bfs from "./algorithms/bfs"
import dfs from './algorithms/dfs';
import dijkstras from "./algorithms/dijkstras_algorithm";
import bestFirstSearch from "./algorithms/best_first_search";
import bellmanFord from "./algorithms/bellman_ford";

/**
 * Main backbone of the whole backend.
 * This class contains the various algorithms which are required to
 * give their outputs to visualise.
 *
 * @author aditya , <adityavikramsinha19@gmail.com>
 */
export default class Algorithms {

    // the graph which the algorithms
    // get to work with
    graph: Graph;

    // comparator
    comparator: (a: string, b: string) => number;

    // Epsilon to weight the aStar algorithm.
    public static EPS: number;

    /**
     * Constructs an Algorithm instance with the comparator as
     * the comparator of the graph input to the _assignGraph parameter.
     * EPS[Epsilon weightage] is also put to 10^-5.
     *
     * @param _assignGraph the graph on which the algorithms
     * will work
     */
    constructor(_assignGraph: Graph) {
        this.graph = _assignGraph;
        this.comparator = this.graph.comparator;
        Algorithms.EPS = 1e-5;
    }

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
     * Classic a-start implementation
     * using heuristics and weights
     *
     * @param start the starting node ID
     * @param end the ending node ID
     * @returns a path | null [path if found, else null] and a Set of visited nodes inorder
     */
    aStar(start: string, end: string): [string[] | NOTSET_t, Set<string>] {

        // first deconstruct the array returned from a-start
        // dist is the distance from start [S]-> every node [A] which is reachable
        // prev is required to reconstruct path
        // visited is the set of nodes visited in order
        const [dist, prev, visited] = this.internalAStar(start, end);

        // this is just to reconstruct the path for a*;
        let path: string[] = [];

        // if distance is infinity,
        // we automatically understand no path is possible
        // thus, return null
        if (dist.get(end) === Infinity)
            return [NOTSET, visited];

        // reconstruct path
        // after that just return
        for (let at: string = end; at !== undefined; at = prev.get(at))
            path.unshift(at);

        // we are sure path exists
        // so we just return it.
        return [path, visited];
    }

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
    static biDirectional(graph: Graph, start: string, end: string): [string[] | NOTSET_t, Set<string>, Set<string>] {

        // get the path from start
        let algo: Algorithms = new Algorithms(BackendStateManager.graph());
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

    /**
     * Internal implementation of the a-star algorithm
     * This algorithm uses EPS [10^-5] and uses multiplication
     * and addition to make an informed choice.
     *
     * @param start starting node ID
     * @param end ending node ID
     * @returns a distance map, a map to reconstruct the path and a set of visited nodes inorder
     */
    private internalAStar(start: string, end: string): [Map<string, number>, Map<string, string>, Set<string>] {

        // created type to have
        // in the Priority Queue
        type Priority = {

            // UID of node
            label: string,

            // min distance from [S]
            minDist: number,

            // min heuristic cost from [S]
            minHeuristic: number
        };

        // making the priority queue to
        // sort the data in the opening nodes
        // the distance map is for understanding if a path exists or not
        // the visited set is for visualisation
        // and to make decisions about whether a node should be opened or not
        const PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minHeuristic);
        const dist: Map<string, number> = new Map(), prev: Map<string, string> = new Map();
        const visited: Set<string> = new Set();

        // set the distances to infinity
        this.graph.vertices().forEach((node) => {
            node.getData() !== start ? dist.set(node.getData(), Infinity) : dist.set(start, 0);
        });

        // getting the start and end nodes
        let dest = this.graph.vertices().get(start), endNode = this.graph.vertices().get(end);

        // Enqueue the first item
        // this way, the PQ is always > 0 when starting.
        PQ.enqueue({label: start, minDist: 0, minHeuristic: this.graph.distBw(dest, endNode)});

        // keeps going while PQ is not exhausted
        while (!PQ.isEmpty()) {

            // deconstruct the object
            const {label, minDist} = PQ.dequeue();

            // add to visited to say that this node has been opened already
            visited.add(label);

            // if we see that the current minDist is > the dist present in the Map
            // then it is evident that there is no point in trying to explore it since
            // it may not yield a better path.
            if (dist.get(label) < minDist)
                continue;

            // open all the neighbour nodes
            // same as a bfs search
            // this bfs gives a cyclic kind of effect
            this.graph.vertices().get(label).getAdjVertices().forEach(edge => {

                // get the data to remove
                // boilerplate code
                let destData = edge.dest.getData();

                // if visited does not have the node
                // then only do we open it.
                // else we can already confirm that all the nodes
                // have either been opened or explored or are going to
                // be explored.
                if (!visited.has(destData)) {

                    // get the new dist
                    // which is dist form [S] of the prev node
                    // + edge cost.
                    let newDist = dist.get(label) + edge.cost;

                    // get heuristics from the previous node
                    // and node to next
                    let newHeuristic = (this.graph.distBw(this.graph.vertices().get(destData),
                        endNode, 'e')) / 1000000 * newDist;

                    // now if newDist is < dist present in dist Map
                    // then only do we update everything
                    // else we do not.
                    if (newDist < dist.get(destData)) {
                        prev.set(destData, label);
                        dist.set(destData, newDist);
                        PQ.enqueue({label: destData, minDist: newDist, minHeuristic: newHeuristic});
                    }
                }
            });

            // if label is end
            // then path has been found
            // we directly return
            if (label === end) return [dist, prev, visited];
        }

        // right now its confirmed that we have no
        // potential path
        return [dist, prev, visited];
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

        // getting a new algorithm instance to run the functions from
        let algo: Algorithms = new Algorithms(graph);

        // using if else and enums to return an output in the form of [path , visitedInOrder] which
        // is later turned directly into an object and given as return from the function
        const [path, visited, visitedEdges] = match(algoType)
            .with(AlgoType.DIJKSTRAS_SEARCH, () => dijkstras(graph, startNodeId, endNodeId))
            .with(AlgoType.A_STAR_SEARCH, () => algo.aStar(startNodeId, endNodeId))
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
        // getting an algorithm instance for ease of running
        let algo = new Algorithms(BackendStateManager.graph());

        // @ts-ignore
        return match(algoType)
            .with(AlgoType.A_STAR_SEARCH, () => {
                const [pathP1, visitedP1] = algo.aStar(startNodeId, bombNodeId);
                const [pathP2, visitedP2] = algo.aStar(bombNodeId, endNodeId);
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
