import Graph from './Graph';
import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import {AlgoType, NOTSET, NOTSET_t} from "./Types";
import BackendStateManager from "../api/BackendStateManager";
import {match} from "ts-pattern";
import bfs from "./algorithms/bfs"
import dfs from './algorithms/dfs';

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
     * Classic implementation of Dijkstras algorithm
     * which opens the nodes using BFS but is weighted.
     * We can call it a weighted BFS in some context.
     *
     * @param start the id of the starting node
     * @param end the id of the end node
     * @returns a path | null [path if found, else] and visited inorder Set.
     */
    dijkstras(start: string, end: string): [string[] | NOTSET_t, Set<string>, Map<string, Set<string>>] {

        // first get everything from the internal Dijkstra function
        const [dist, prev, visited, visitedEdges] = this.internalDijkstras(start, end);

        // the rest is just finding the path to use.
        let path: string[] = [];

        // if distance is Infinity then,
        // we know path is not found.
        // directly return
        if (dist.get(end) === Infinity)
            return [NOTSET, visited, visitedEdges];

        // if it is not null,
        // we know there must be a path that exists
        // so reconstruct it.
        for (let at: string = end; at !== undefined; at = prev.get(at)) path.unshift(at);

        // return reconstructed path.
        return [path, visited, visitedEdges];
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
     * Classic bellman ford to find negative cycles
     * and for shortest path node relaxation
     *
     * @param start starting ID
     * @param end ending ID
     * @returns a path | null [path if found, else null] and a Set of visited nodes inorder
     */
    bellmanFord(start: string, end: string): [string[] | NOTSET_t, Set<string>, Map<string, Set<string>>] {

        // First get all the data from internal bellman ford
        // we get dist to understand if last node [end] was relaxed or not
        // if it was then we can construct a path
        // else we return null since that means there is not a single path
        const [dist, prev, visited, visitedEdges] = this.internalBellmanFord(start);

        // path array
        let path: string[] = [];

        // checking for if the last node [end] was relaxed or not
        if (dist.get(end) === Infinity)
            return [NOTSET, visited, visitedEdges];

        // path reconstruction
        for (let at = end; at !== undefined; at = prev.get(at))
            path.unshift(at);

        // return path
        // which is guaranteed to be the shortest path
        // in the graph from start->end.
        return [path, visited, visitedEdges];
    }

    /**
     *
     * @param start starting node of the path to be found
     * @returns a Map of relaxed distances from start node [S] to all other nodes
     * a Map of previous nodes to construct a path and,
     * a Set of visited nodes.
     */
    internalBellmanFord(start: string): [Map<string, number>, Map<string, string>, Set<string>, Map<string, Set<string>>] {

        // dist is for the possibility of relaxation
        // this also signifies if a path from the start -> end
        // exists since if end is not relaxed [i.e. end remains Infinity]
        // it means it is unreachable
        let dist: Map<string, number> = new Map();


        // Set of visited nodes inorder
        let visited: Set<string> = new Set();
        // Map to help in path reconstruction
        let prev: Map<string, string> = new Map();

        const visitedEdges: Map<string, Set<string>> = new Map();
        // Set all the dist to Infinity
        // minus the start node
        this.graph.vertices().forEach((node) => {
            node.getData() !== start ? dist.set(node.getData(), Infinity) : dist.set(start, 0);
        });

        // then we take the count of the number of vertices
        // since Bellman ford must go from 0...V-1 (at most). It can end before
        // too.
        const V = this.graph.vertices().size;

        // this keeps track of number of relaxations in a pass through
        // if the changes goes down to 0, then we know any subsequent pass will yield the same
        // results so we can ignore 0...V-1 and do less
        // it's a quirky optimisation.
        let changes = 1;

        for (let v = 0; v < V - 1 && changes > 0; v++) {

            changes = 0
            // each time we go through each node of the graph
            this.graph.vertices().forEach((node) => {

                // and each edge in the graph from this node
                // we open it up and try to see if
                // relaxation is possible or not
                node.getAdjVertices().forEach(edge => {

                    // if visited does not have the node
                    // we simply add it.
                    if (!visited.has(edge.dest.getData()))
                        visited.add(edge.dest.getData());

                    // if the current cost < prev cost of traversal
                    // from start to this node
                    // then we try to
                    // update it
                    if (dist.get(node.getData()) + edge.cost < dist.get(edge.dest.getData())) {

                        // update its new best distance
                        dist.set(edge.dest.getData(), dist.get(node.getData()) + edge.cost);

                        // set it as a possible path candidate
                        prev.set(edge.dest.getData(), node.getData());

                        // update changes
                        changes++;

                        Algorithms.addVisitedEdge(visitedEdges, node.getData(), edge.dest.getData())
                    }
                })
            })
        }

        // return everything that was promised.
        return [dist, prev, visited, visitedEdges];
    }

    /**
     * Starts a weighted , bidirectional ,dijkstras search
     * to find a path
     *
     * @param start the starting node ID
     * @param end target/end node ID
     * @returns a path | null [path if present, else null] and two sets, first is of a search
     * from the Start till some point X and second is from the end till the same point X where
     * both of these algorithms meet.
     */
    static biDirectional(start: string, end: string): [string[] | NOTSET_t, Set<string>, Set<string>] {

        // get the path from start
        let algo: Algorithms = new Algorithms(BackendStateManager.graph());
        const pathFromStart = algo.dijkstras(start, end)[0];

        // if it is null , we automatically know
        // the there is no path possible
        if (pathFromStart === NOTSET) {

            // we just get visited from start and visited from end Sets
            let visitedFromStart = algo.dijkstras(start, end)[1];
            let visitedFromEnd = algo.dijkstras(end, start)[1];

            // we return the path from start [or null] and the two sets as promised.
            return [NOTSET, visitedFromStart, visitedFromEnd];
        }

        // else, we splice the path
        // at mid-point >> 1
        // also we can 100% confirm that it is not NOT_SET
        let spliceNode: string = pathFromStart[(pathFromStart as string[]).length >> 1];

        // we get from this splice point a visited from start
        // and a visited from end
        let visitedFromStart = algo.dijkstras(start, spliceNode)[1];
        let visitedFromEnd = algo.dijkstras(end, spliceNode)[1];

        // then we return the whole thing as promised.
        return [pathFromStart, visitedFromStart, visitedFromEnd];
    }

    /**
     * A classic greedy algorithm which only uses heuristic approach
     * it is an unguided and unweighted a-star algorithm
     * and cannot guarantee best or shortest path in tough situations.
     *
     * @param start starting node ID
     * @param end ending node ID
     * @returns a path | null [path if found, else null] and a Set of visited nodes inorder.
     */
    bestFirstSearch(start: string, end: string): [string[] | NOTSET_t, Set<string>] {

        // first get all the internal information from the implementation
        // prev is for path deconstruction and ,
        // visited in order is for
        // visualisation
        let [prev, visited] = this.internalBestFirstSearch(start, end);

        // if prev is null then we know that
        // there is no path
        if (prev === null)
            return [NOTSET, visited];

        // path array
        let path: string[] = [];

        // reconstruct path
        for (let at = end; at !== undefined; at = prev.get(at))
            path.unshift(at);

        // return the path since it exists.
        return [path, visited];
    }

    /**
     * Implementation of best first search greedy mechanism
     *
     * @param start starting node id
     * @param end ending node id
     * @returns a Map for path reconstruction and a Set of visited nodes inorder
     */
    private internalBestFirstSearch(start: string, end: string): [Map<string, string>, Set<string>] {

        // creating a type
        // for priority queue
        // and other sorting
        type Priority = {

            // name of the node or its ID
            label: string,

            // min heuristic cost to end node [end]
            minHeuristic: number
        }

        // Getting a priority queue for ordering of nodes.
        let PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minHeuristic);

        // prev is to reconstruct path
        let prev: Map<string, string> = new Map();

        // visited is for remembering which nodes
        // have been visited
        let visited: Set<string> = new Set();

        // start and end nodes have been given values
        let dest = this.graph.vertices().get(start), endNode = this.graph.vertices().get(end);

        // we enqueue the starting node
        PQ.enqueue({label: start, minHeuristic: this.graph.distBw(dest, endNode)});

        // while PQ is not empty
        // we keep running till we have
        // exhausted all the possible
        // expandable nodes
        while (!PQ.isEmpty()) {

            // get the ID of the node
            const {label} = PQ.dequeue();

            // add it to visited since it has been explored now
            visited.add(label);

            // get ready to explore all the edges going out of it
            this.graph.vertices().get(label).getAdjVertices().forEach(edge => {

                // getting the data or id of the destination nodes
                let destData = edge.dest.getData();

                // if visited does not have those nodes
                // it means there is a possibility of a better path
                // hence we should enqueue them
                if (!visited.has(destData)) {

                    // we get a new heuristic approach
                    let newHeuristic = this.graph.distBw(edge.dest, endNode);

                    // we enqueue and then set the nodes as required
                    PQ.enqueue({label: destData, minHeuristic: newHeuristic});
                    prev.set(destData, label);
                }
            });

            // if the id or label is end
            // then there has to be a path
            // hence we return prev and visited
            if (label === end) return [prev, visited];
        }

        // if till here also the function has come
        // that means end is not reachable
        // hence we return null and visited
        // to signify no path
        return [null, visited];
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
     * Internal implementation of the dijkstras algorithm.
     *
     * @param start the starting node ID
     * @param end the ending node ID
     * @returns a dist Map to show the distances between the nodes, a Map which has the prev nodes and, a Set for visited nodes inorder.
     */
    private internalDijkstras(start: string, end: string):
        [Map<string, number>, Map<string, string>, Set<string>, Map<string, Set<string>>] {

        // Creating a type to hold the important
        // properties for the Priority Queue.
        type Priority = {
            info: {
                label: string,
                srcLabel: string
            },
            minDist: number;
        }

        // Priority Queue for total ordering through the
        // minDist property.
        let PQ = new MinPriorityQueue<Priority>((promisingNode) => promisingNode.minDist);

        // dist map for shortest distance between
        // a node [A] and the Start node [S]
        let dist: Map<string, number> = new Map(), prev: Map<string, string> = new Map();

        // Set of all visited nodes
        let visited: Set<string> = new Set();

        // Map of all visited Edges
        let visitedEdges: Map<string, Set<string>> = new Map();

        // First we set the value of distances from node [S]
        // to any node [A] to infinity
        this.graph.vertices().forEach((node) => {
            node.getData() !== start ? dist.set(node.getData(), Infinity) : dist.set(start, 0);
        });

        // Enqueue the first node,
        // this way we have a length of 1
        // and least distance of 0.
        PQ.enqueue({
            info: {
                label: start, srcLabel: start
            }, minDist: 0
        });

        // While it is not empty,
        // nodes should be dequeued from the
        // PQ.
        while (!PQ.isEmpty()) {

            // get the Priority Object and deconstruct it
            const {
                info: {
                    label, srcLabel
                }, minDist
            } = PQ.dequeue();

            Algorithms.addVisitedEdge(visitedEdges, srcLabel, label);

            // add it to visited so that
            // we do not keep opening it.
            visited.add(label);

            // if the dist > minDist then
            // we know that we can open it
            // since we get a better route.
            if (dist.get(label) < minDist)
                continue;
            // follow the BFS pattern
            // we open every neighbour
            // and explore it
            // the ordering is based on their min dist
            // hence a priority queue.
            this.graph.vertices().get(label).getAdjVertices().forEach(edge => {

                // first get the destination node
                const dest = edge.dest.getData();

                // if visited does not have destination
                // then it means that it has not been explored
                // hence there is merit in the fact that it might be
                // helpful to open it.
                if (!visited.has(dest)) {

                    // new Dist will be the dist till now + the cost of moving from
                    // the prev node to this node
                    let newDist = dist.get(label) + edge.cost;

                    // if new Dist < the current dist of the destination
                    // then we add
                    // this is bound to hit every node once
                    // since starting value in distance for every node is
                    // infinity.
                    if (newDist < dist.get(dest)) {

                        // we reference this node in case it is a part of the
                        // path
                        prev.set(dest, label);

                        // update the distance from [S] to this node [A]
                        dist.set(dest, newDist);

                        // enqueue this for opening in terms of minDist.
                        PQ.enqueue({
                            info: {
                                label: dest,
                                srcLabel: label
                            }, minDist: newDist
                        });
                    }
                }
            });

            // if label is the same as end
            // then we know that, there is a path
            // and return all the items for reconstruction.
            if (label === end) return [dist, prev, visited, visitedEdges];
        }

        // at this point, the end dist is Infinity
        // thus we know that it has not been relaxed
        // hence, we need to go about and just return everything to caller
        // the caller has the ability to understand if
        // the given end dist is Infinity or not.
        return [dist, prev, visited, visitedEdges];
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
            .with(AlgoType.DIJKSTRAS_SEARCH, () => algo.dijkstras(startNodeId, endNodeId))
            .with(AlgoType.A_STAR_SEARCH, () => algo.aStar(startNodeId, endNodeId))
            .with(AlgoType.BREADTH_FIRST_SEARCH, () => bfs(graph, startNodeId, endNodeId))
            .with(AlgoType.DEPTH_FIRST_SEARCH, () => dfs(graph, startNodeId, endNodeId))
            .with(AlgoType.BELLMAN_FORD, () => algo.bellmanFord(startNodeId, endNodeId))
            .with(AlgoType.BEST_FIRST_SEARCH, () => algo.bestFirstSearch(startNodeId, endNodeId))
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
                const [pathP1, visitedP1] = algo.bellmanFord(startNodeId, bombNodeId);
                const [pathP2, visitedP2] = algo.bellmanFord(bombNodeId, endNodeId);
                const path =
                    pathP1 !== NOTSET && pathP2 !== NOTSET
                        ? (pathP1 as string[]).concat((pathP2 as string[]).slice(1))
                        : NOTSET as NOTSET_t;
                return {path, visitedP1, visitedP2};
            })
            .with(AlgoType.DIJKSTRAS_SEARCH, () => {
                const [pathP1, visitedP1] = algo.dijkstras(startNodeId, bombNodeId);
                const [pathP2, visitedP2] = algo.dijkstras(bombNodeId, endNodeId);
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
                const [pathP1, visitedP1] = algo.bestFirstSearch(startNodeId, bombNodeId);
                const [pathP2, visitedP2] = algo.bestFirstSearch(bombNodeId, endNodeId);
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
