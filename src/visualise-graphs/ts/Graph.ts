import Vertex from './Vertex';

/**
 * Utility graph class with functions to help in maintaining state and making the algorithms work.
 * It is a Map of vertices, each vertex is connection through the Edges and together get
 * to make a Graph.
 *
 * Logical representation of the graph is :
 * vertex <-> vertex <-> vertex
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export default class Graph {
    // freeze guard
    private frozen = false;

    // A Map which represents the Graph internally
    vs: Map<string, Vertex> = new Map();

    // Comparator for ordering of the vertices in the Graph.
    comparator: (a: string, b: string) => number;

    // Implementation of a Cyclic Graph.
    isCyclic: boolean;

    // Implementation of an Undirected Graph.
    isUndirected: boolean;

    /**
     * Constructs a new graph with a given comparator to compare the values of two vertices.
     * The Map of the graph is null.
     * the graph is set to all default values.
     *
     * @param comparator the comparator which the class should be using for ordering.
     */
    constructor(comparator: (a: string, b: string) => number) {
        this.comparator = comparator;
        this.isUndirected = false;
    }

    /**
     * @returns back a map of vertices (id , real object) present in the graph.
     */
    vertices(): Map<string, Vertex> {
        return this.vs;
    }

    /**
     * Sets the x and y coordinates of a particular vertex.
     *
     * @param data the vertex whose coordinates need to be changed .
     * @param x the x coordinate
     * @param y the y coordinate
     */
    setNodeCoords(data: string, { x, y }: { x: number; y: number }): void {
        this.assertMutable();
        this.vertices().get(data).setCoords(x, y);
    }

    /**
     * Returns if a vertex is present in the graph.
     *
     * @param data the vertex to search for
     * @returns true if a vertex is present in the graph , else false .
     */
    hasVertex(data: string): boolean {
        return this.vertices().get(data) !== undefined;
    }

    /**
     * Returns if there is an edge between a given source vertex and a given destination vertex.
     * This only works if both vertices
     * are in the graph, else it does not work and returns false
     *
     * @param source the starting point of the edge
     * @param destination the ending point of the edge
     * @returns true if an edge exists, else false.
     */
    hasEdge(source: string, destination: string): boolean {
        const src = this.vertices().get(source);

        if (src === undefined) return false;
        return src.getAdjVertices().has(destination);
    }

    /**
     * Adds a vertex object to the graph if it is not already present.
     * @param data the vertex data to add.
     * @param x optional x coordinate
     * @param y optional y coordinate
     * @returns the added vertex or, just the vertex which exists with the same ID.
     */
    addNode(data: string, x: number = 0, y: number = 0): Vertex {
        this.assertMutable();
        let vertex = this.vertices().get(data);
        if (vertex !== undefined) return vertex;
        vertex = new Vertex(data, this.comparator, x, y);
        this.vertices().set(data, vertex);
        return vertex;
    }

    /**
     * Removes a vertex from the graph if it is present.
     * This includes removal of any and all connections to and from the
     * vertex in the graph.
     *
     * @param data the data or id of the vertex to be removed .
     * @returns Null if the vertex does not exist. If it does, then the vertex is returned.
     */
    rmNode(data: string): Vertex | null {
        this.assertMutable();
        const nodeToRm = this.vertices().get(data);
        if (!nodeToRm) return null;
        this.vertices().forEach((vertex) => {
            vertex.rmAdjVertex(nodeToRm.getData());
        });
        this.vertices().delete(data);
        return nodeToRm;
    }

    /**
     * Ensures that no modifications can be made to the graph once it has been frozen.
     * @private
     */
    private assertMutable() {
        if (this.frozen)
            throw new Error(
                'The graph has been frozen, no operations that modify the graph can be done',
            );
    }

    /**
     * Adds an edge between the source and destination vertices.
     * There is a given cost which HAS to be specified and thus,
     * depending on if the graph is a directed one or an undirected one,
     * the edge addition with we either both way or only singular
     * way.
     *
     * @param source the vertex to add the connection from
     * @param destination the vertex to add the connection to
     * @param cost the cost of the connection between them.
     */
    addEdge(source: string, destination: string, cost: number): void {
        this.assertMutable();
        const src = this.vertices().get(source);
        const dest = this.vertices().get(destination);
        src.addAdjVertex(dest, cost);
        if (this.isUndirected) dest.addAdjVertex(src, cost);
    }

    /**
     * Removes an edge between a valid source vertex and a valid destination vertex.
     * In case the graph is cyclic, it will remove
     * an edge from both the destination to source vertex and from the source vertex to the destination vertex.
     * If the flag is off then it will not remove the edge from the destination vertex to source vertex.
     * This function just requires the vertex ids to check if the vertices are present.
     * After that it gets the vertices from the internal storage.
     *
     * @param source the vertex id from which the connection starts
     * @param destination the vertex id at which the connection ends
     */
    rmEdge(source: string, destination: string): void {
        this.assertMutable();
        const src = this.vertices().get(source);
        const dest = this.vertices().get(destination);
        if (src && dest) {
            src.rmAdjVertex(destination);
            if (this.isUndirected) dest.rmAdjVertex(source);
        }
    }

    /**
     * Gives the Euclidean distance between two vertices in the graph
     * based on their x and y coordinates on a 2-D plane.
     *
     * @param _this the start vertex
     * @param _that the end vertex.
     * @param whatType is the type of distance required, m for manhattan and e for Euclidean
     * @returns the value of this function.
     */
    distBw(
        _this: { x: number; y: number },
        _that: {
            x: number;
            y: number;
        },
        whatType: string = 'e',
    ): number {
        if (whatType === 'e')
            return Math.sqrt(Math.pow(_that.x - _this.x, 2) + Math.pow(_that.y - _this.y, 2));
        else return Math.abs(_this.x - _that.x) + Math.abs(_this.y - _that.y);
    }

    /**
     * Freezes this object by setting its state to frozen and preventing any further modifications.
     */
    freeze(): void {
        this.frozen = true;
    }

    /**
     * Takes an initial Graph (_initGraph) and (_presentGraph), then, for a given vertex in the
     * _presentGraph it reverts the vertices state back the vertices state in the _initGraph.
     * This means that the properties of the vertex in _initGraph and _presentGraph
     * should be exactly the same, unless a neighbours of it is not present in the _presentGraph.
     * It does not make any new vertices except for the one vertex with a data passed in as parameter.
     * The cost of the connections also reflect the cost in the _initGraph.
     *
     * @param data the vertex whose state needs to be reverted to from the _initGraph.
     * @param _initGraph the _initGraph whose vertex state needs to be copied
     * @param _presentGraph the present graph in which the changes need to be made.
     */
    static revertNode(data: string, _initGraph: Graph, _presentGraph: Graph): void {
        const initialNode = _initGraph.vertices().get(data);
        _presentGraph.addNode(data);
        const presentNode = _presentGraph.vertices().get(data);

        initialNode.getAdjVertices().forEach((edge) => {
            const presentEdgeDest = _presentGraph.vertices().get(edge.dest);

            if (presentEdgeDest !== undefined) {
                presentNode.addAdjVertex(presentEdgeDest, edge.cost);
                presentEdgeDest.addAdjVertex(presentNode, edge.cost);
            }
        });
    }

    /**
     * Update cost of edge from Source to Destination to the given value.
     * This is a O(E) cost, since it will have to go over ALL the edges and
     * find the edge with the actual Destination.
     * @param srcId
     * @param destId
     * @param cost
     * @return true if updated or false if not updated(either vertex does not exist or edge does not exist or both)
     */
    updateEdgeCost(srcId: string, destId: string, cost: number) {
        const vertex = this.vertices().get(srcId);
        if (vertex === undefined) return false;
        const targetEdge = vertex.getAdjVertices().get(destId);
        if (targetEdge === undefined) return false;
        targetEdge.cost = cost;
        return true;
    }

    /**
     * Copies the state of one graph to another graph and then changes the cost as specified.
     *
     * @param _initial the initial graph whose state needs to be copied
     * @param _present the present graph to which the state needs to be copied
     * @param cost the cost of edges.
     */
    static copy(_initial: Graph, _present: Graph, cost: number): void {
        //first reset all active connections
        _initial.vertices().forEach((initNode) => {
            if (!_present.vertices().has(initNode.getData())) {
                this.revertNode(initNode.getData(), _initial, _present);
            }
        });

        //then reset all active costs.
        _present.vertices().forEach((initNode) => {
            initNode.getAdjVertices().forEach((edge) => {
                if (edge.dest !== initNode.getData() && edge.cost > 1) edge.changeCost(cost);
            });
        });
    }
}
