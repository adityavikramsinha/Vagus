import Node from "./Node";




/**
 * Utility graph class with functions to help in maintaining state and making the algorithms work.
 * It is a Map of Nodes, each node is connection through the Edges and together get
 * to make a Graph.
 *
 * Logical representation of the graph is :
 * node <-> node <-> node
 *
 * @author aditya , <adityavikramsinha19@gmail.com>
 */
export default class Graph<T> {

  // A Map which represents the Graph internally
  Nodes: Map<T, Node<T>> = new Map();

  // Comparator for ordering of the nodes in the Graph.
  comparator: (a: T, b: T) => number;

  // Implementation of a Cyclic Graph.
  isCyclic: boolean;

  // Implementation of an Undirected Graph.
  isUndirected: boolean;

  /**
   * Constructs a new graph with a given comparator to compare the values of two nodes.
   * The Map of the graph is null.
   * the graph is set to all default values.
   *
   * @param comparator the comparator which the class should be using for ordering.
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
    this.isUndirected = false;
  }

  /**
   * @returns back a map of nodes (id , real object) present in the graph.
   */
  nodes(): Map<T, Node<T>> {
    return this.Nodes;
  }

  /**
   * Sets the x and y coordinates of a particular node.
   *
   * @param data the node whose coordinates need to be changed .
   * @param x the x coordinate
   * @param y the y coordinate
   */
  setNodeCoords(data: T, { x, y }: { x: number, y: number }):void{
    this.nodes().get(data).setCoords(x, y);
  }

  /**
   * Returns if a node is present in the graph.
   *
   * @param data the node to search for
   * @returns true if a node is present in the graph , else false .
   */
  nodeExists(data: T): boolean {
    return this.nodes().get(data) !== undefined;
  }

  /**
   * Returns if there is an edge between a given source node and a given destination node.
   * This only works if both nodes
   * are in the graph, else it does not work and returns false
   *
   * @param source the starting point of the edge
   * @param destination the ending point of the edge
   * @returns true if an edge exists, else false.
   */
  edgeExists(source: T, destination: T): boolean {
    const src = this.nodes().get(source);

    if (src === undefined)
      return false;

    const at: number = src.getAdjNodes().findIndex(edge => {
      return edge.dest.getData() === destination;
    });

    return at >= 0;
  }

  /**
   * Adds a Node object to the graph if it is not already present.
   * @param data the node data to add.
   * @returns the added node or, just the node which exists with the same ID.
   */
  addNode(data: T): Node<T> {
    let node = this.nodes().get(data);
    if (node !== undefined)
      return node;
    node = new Node(data, this.comparator);
    this.nodes().set(data, node);
    return node;
  }

  /**
   * Removes a node from the graph if it is present.
   * This includes removal of any and all connections to and from the
   * node in the graph.
   *
   * @param data the data or id of the node to be removed .
   * @returns Null if the node does not eixst. If it does, then the node is returned.
   */
  rmNode(data: T): Node<T> | null {
    const nodeToRm = this.nodes().get(data);
    if (!nodeToRm) return null;
    this.nodes().forEach((node) => {
      node.rmAdjNode(nodeToRm.getData());
    })
    this.nodes().delete(data);
    return nodeToRm;
  }

  /**
   * Adds an edge between the source and destination nodes.
   * There is a given cost which HAS to be specified and thus,
   * depending on if the graph is a directed one or an undirected one,
   * the edge addition with we either both way or only singular
   * way.
   *
   * @param source the node to add the connection from
   * @param destination the node to add the connection to
   * @param cost the cost of the connection between them.
   */
  addEdge(source: T, destination: T, cost: number): void {
    let src = this.nodes().get(source);
    let dest = this.nodes().get(destination);
    src.addAdjNode(dest, cost);
    if (this.isUndirected) dest.addAdjNode(src, cost);
  }

  /**
   * Removes an edge between a valid source node and a valid destination node.
   * In case the graph is cyclic, it will remove
   * an edge from both the destination to source node and from the source node to the destination node.
   * If the flag is off then it will not remove the edge from the destination node to source node.
   * This function just requires the node ids to check if the nodes are present.
   * After that it gets the nodes from the internal storage.
   *
   * @param source the node id from which the connection starts
   * @param destination the node id at which the connection ends
   */
  rmEdge(source: T, destination: T):void{
    const src = this.nodes().get(source);
    const dest = this.nodes().get(destination);
    if (src && dest) {
      src.rmAdjNode(destination);
      if (this.isUndirected)
        dest.rmAdjNode(source);
    }
  }

  /**
   * Gives the euclidean distance between two nodes in the graph
   * based on their x and y coordinates on a 2-D plane.
   *
   * @param _this the start node
   * @param _that the end node.
   * @param whatType is the type of distance required, m for manhattan and e for euclidean
   * @returns the value of this function.
   */
  distBw(_this: Node<T>, _that: Node<T>, whatType: string = 'e'): number {
    if (whatType === 'e')
      return Math.sqrt(Math.pow(_that.x() - _this.x(), 2) + Math.pow(_that.y() - _this.y(), 2));
    else
      return Math.abs(_this.x() - _that.x()) + Math.abs(_this.y() - _that.y());
  }

  /**
   * Freezes this object based on the specifications given by Object.freeze()
   */
  freeze(): void {
    Object.freeze(this);
  }

  /**
   * The freeze() method freezes a graph. A frozen graph can no longer be changed;
   * freezing a graph prevents new properties from being added to it, existing properties
   * from being removed, prevents changing the enumerability, configurability, or writability
   * of existing properties, and prevents the values of existing properties from being changed. In
   * addition, freezing an object also prevents its prototype from being changed.
   *
   * @param graph the graph to be frozen
   * @see freeze
   */
  static freeze<T>(graph: Graph<T>):void { Object.freeze(graph); }

  /**
   * Takes an initial Graph (_initGraph) and (_presentGraph), then, for a given node in the
   * _presentGraph it reverts the nodes state back the nodes state in the _initGraph.
   * This means that the properties of the node in _initGraph and _presentGraph
   * should be exactly the same, unless a neighbours of it is not present in the _presentGraph.
   * It does not make any new nodes except for the one node with a data passed in as parameter.
   * The cost of the connections also reflect the cost in the _initGraph.
   *
   * @param data the node whose state needs to be reverted to from the _initGraph.
   * @param _initGraph the _initGraph whose node state needs to be copied
   * @param _presentGraph the present graph in which the changes need to be made.
   */
  static revertNode<T>(data: T, _initGraph: Graph<T>, _presentGraph: Graph<T>): void {
    let initialNode: Node<T> = _initGraph.nodes().get(data);
    _presentGraph.addNode(data);
    let presentNode: Node<T> = _presentGraph.nodes().get(data);

    initialNode.getAdjNodes().forEach(edge => {
      let presentEdgeDest = _presentGraph.nodes().get(edge.dest.getData());

      if (presentEdgeDest !== undefined) {
        presentNode.addAdjNode(presentEdgeDest, edge.cost);
        presentEdgeDest.addAdjNode(presentNode, edge.cost);
      }
    })
  }

  /**
   * Updates the cost of all incoming edges (where the node is the end point) to a certain given cost.
   * This function only runs if a given node is present in the graph .
   *
   * @param data the node whose incoming edges need to be updated to that cost
   * @param cost the cost to update the edges to.
   */
  updateCostOfIncoming(data: T, cost: number):void{
    let node: Node<T> = this.nodes().get(data);
    if (node === undefined) return;
    node.getAdjNodes().forEach((edge) => {
      if (edge.dest.getData() !== node.getData()) {
        edge.dest.updateCostTo(node, cost);
      }
    });

  }

  /**
   * Copies the state of one graph to another graph and then changes the cost as specified.
   *
   * @param _initial the initial graph whose state needs to be copied
   * @param _present the present graph to which the state needs to be copied
   * @param cost the cost of edges.
   */
  static copy<T>(_initial: Graph<T>, _present: Graph<T>, cost: number):void{

    //first reset all active connections
    _initial.nodes().forEach((initNode) => {
      if (!_present.nodes().has(initNode.getData())) {
        this.revertNode(initNode.getData(), _initial, _present);
      }
    });

    //then reset all active costs.
    _present.nodes().forEach((initNode)=>{
      initNode.getAdjNodes().forEach((edge) => {
        if (edge.dest.getData() !== initNode.getData() && edge.cost > 1)
          edge.changeCost(cost);
      });
    });
  }
}
