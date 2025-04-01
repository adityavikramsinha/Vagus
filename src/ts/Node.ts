import Edge from './Edge';



/**
 * This is the node class of this project.
 * This is also the most impotant class in this project.
 * The main reason why this is so important is that it is the smallest
 * UNIT present in this project and refers to a single entity which can
 * be manipulated.
 *
 * If a logical schema for this class was drawn, then it would look something
 * like this
 *           neighbour <- |===| -> neighbour
 * According to our needs, the total cap has been put to 7 neighbours [including itself]
 * This is not a class level cap, it is a project level cap.
 *
 * This class can also deal with any type of "node", in our project it is
 * a number.
 *
 * @author aditya , <adityavikramsinha19@gmail.com>
 */
export default class Node<T> {

  //id or the UID of a node
  private readonly data: T;

  // List of neighbours [refer to logical diagram] in the form of
  // src -> cost -> dest where cost is the cost of moving from THIS node to
  // its neighbour node.
  private readonly adjNodes: Edge<T>[];

  // Placement on the hexboard, x coordinate system.
  private xCoord: number = 0;

  // Placement on the hexboard, y coordinate system.
  private yCoord: number = 0;

  /**
   * Function takes in both a string and a number.
   * Incase it is a number, it will directly assign the coordinate
   * Incase it is a string, it attempts to parse it.
   * After parsing it and converting it to a number, it will update value
   *
   * If it cannot parse it, then it will lead to an error which means no update will take place
   * Hence the coordinate will remain 0[default value] or the previous current input remains.
   *
   * @param x x coordinate of the node on the hex board
   */
  setX(x: number | string): void {
    if (typeof x === "string") this.xCoord = parseFloat(x);
    else this.xCoord = x;
  }

  /**
   * Function takes in either a string or a number.
   * Incase it is a number, the function directly assigns the y coordinate
   * Incase the input is a string, the function attempts to parse it.
   *
   * If the parsing works, then it will update the value.
   * If the parsing fails, the y coordinate is not updated and remains at
   * 0[unless previously a correct input was given]
   *
   *
   * @param y y coordinate of the node on the hex board
   */
  setY(y: number | string): void {
    if (typeof y === "string") this.yCoord = parseFloat(y);
    else this.yCoord = y;
  }

  /**
   * Function takes in either string or number.
   * Upon getting the inputs, it will pass them on to the individual
   * setX and setY functions.
   * Over there, attempts are either made to parse a string input or
   * to assign the number input.
   *
   * Upon success both are updated
   * If either one fails then the other one is updated while the failed one
   * remains unchanged.
   * If both fail then both remain unchanged.
   *
   * Default value again is 0 to begin with.
   *
   * @param x x coordinate of this node
   * @param y y coordinate of this node
   */
  setCoords(x: number | string, y: number | string): void {
    this.setX(x);
    this.setY(y);
  }

  /**
   *
   * @returns The x coordinate of the this node.
   */
  x(): number {
    return this.xCoord;
  }

  /**
   *
   * @returns The y coordinate of this node
   */
  y(): number {
    return this.yCoord;
  }

  /**
   *
   * @returns An object that has the x and y coordinates of
   * this node.
   */
  coordinates(): {x: number, y: number} {
    return { x: this.xCoord, y : this.yCoord };
  }

  // comparator for total ordering in the Node class
  // In this project it is being used in the Priority Queue implementations
  // of the Algorithnms.
  comparator: (a: T, b: T) => number;

  /**
   * Constructs a given Node with the values as given to the constructor.
   * By default:
   * The Node has its data as nothing
   * The Node has no comparator
   * The Node has itself as a neighbour
   * The node has 0 , 0 as its x and y coordinates
   *
   * @param data the id of the node a data which needs to be wrapped by the Node class
   * @param comparator comaparator for total ordering and other le,ge,eq operations
   * @param x x coordinate of the node
   * @param y y coordinate of the node
   */
  constructor(data: T, comparator: (a: T, b: T) => number, x: number = 0, y: number = 0) {
    this.data = data;
    this.comparator = comparator;
    this.adjNodes = [];
    this.adjNodes.push(new Edge(this, 0));
    this.setX(x);
    this.setY(y);
  }

  /**
   *
   * @returns The data wrapped around by the Node
   */
  getData(): T {
    return this.data;
  }

  /**
   *
   * @returns
   * An array of edges which contains the neighbouring nodes of this node.
   */
  getAdjNodes(): Edge<T>[] {
    return this.adjNodes;
  }

  /**
   * Adds a given node as a neighbour OR "adjacent node" to this node
   * provided that, there is no other adjacent neighbour with the same ID.
   * Also, this connection is an out going connection.
   *
   * @param node The node to add
   * @param cost The cost of travelling form this not to the node to be added
   * @returns nothing
   */
  addAdjNode(node: Node<T>, cost: number): void {
    if (this.adjNodes.every(edge =>
      edge.dest.getData() !== node.getData()
    ))// first assert that NO edge present has the same data as the new candidate node.
      this.adjNodes.push(new Edge(node, cost));
  }

  /**
   * Updates the cost of movement from this node to a neighbour which is
   * present in the adjacent list array.
   *
   * @param node the node for which the cost needs to be updated
   * @param cost the new cost.
   * @returns true if there was a successful updation, else false.
   */
  updateCostTo(node: Node<T>, cost: number): boolean {

    // first get the node to update.
    let edgeToUpdate = this.adjNodes.find(edge => {
      if (edge.dest.getData() === node.getData()){
        return edge;
      }
      //return undefined, if nothing has been found.
      else return undefined;
    });

    // if it is undefined, then the given node does not exist
    // thus, we return false
    if (edgeToUpdate === undefined) return false;

    // else just update
    edgeToUpdate.cost = cost;

    // return true.
    return true;
  }

  /**
   * Removes a node from the given list of neighbours.
   * If, it does not exist then null is returned.
   * If it does, then it is removed.
   * @param data the data of the Node to be removed
   * @returns
   * if a node with that data was found, then it returns that node. If it doesnt exist then
   * null is returned
   */
  rmAdjNode(data: T): Node<T> | null {
    const index = this
      .adjNodes
      .findIndex(edge => this.comparator(edge.dest.data, data) === 0);

    // when the index > -1, it means that a match was found.
    if (index > -1)
      return this.adjNodes.splice(index, 1)[0].dest;

    // else return null
    else return null;
  }

  /**
   * An example of the meta-data returned from this function is:
   * data: xxxx ,
   * Neighbours : [
   *    {data:xxxx, cost:xxxx},
   *    {data:xxxx, cost:xxxx}
   * ]
   * coords: {
   *    x:XXXX,
   *    y:YYYY
   * }
   * @returns the string representation of the given Node
   */
  toString(): string {
    let metaData: string = 'data:' + this.data + ',\nNeighbours:[\n';
    this.adjNodes.forEach(edge => {
      metaData += "    {dest:" + edge.dest.getData() + ", cost:" + edge.cost + "},\n";
    });
    metaData += "]\ncoords:{";
    metaData += "\n     x:" + this.xCoord;
    metaData += "\n     y:" + this.yCoord;
    metaData += "\n}";
    return metaData;
  }

  /**
   * Function returns a pseudo-random neighbour.
   * Function does not return a this node as a neighbour.
   *
   * @returns A random neighbour from the list of neighbours
   */
  getRandomNeighbour(): Node<T> {
    while (true) {
      let neighbour = this.getAdjNodes()[Math.floor(Math.random() * this.getAdjNodes().length)].dest;
      if (neighbour.getData() !== this.data || this.adjNodes.length === 1)
        return neighbour;
    }
  }
}
