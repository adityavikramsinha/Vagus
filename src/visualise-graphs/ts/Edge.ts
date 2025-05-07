import Vertex from "./Vertex";

/**
 * This class is the backbone of the graph architecture.
 * This class allows movement from one node [src] to another node [dest] at a certain cost
 *
 * The logical representation of this class is :
 * src -> cost -> dest.
 *
 * @author aditya , <adityavikramsinha19@gmail.com>
 */
export default class Edge {

  src : string;
  // the dest node
  dest: string;

  // the cost of traversal
  cost: number;

  /**
   * Constructs a new Edge with a given destination node and cost from the source node.
   *
   * @param src the source node to make a connection from
   * @param dest the destination node to make a connection to
   * @param cost the cost of movement from the source node to the destination node.
   */
  constructor(src:string, dest: string, cost: number) {
    this.dest = dest;
    this.cost = cost;
    this.src = src;
  }

  /**
   * Updates or changes the cost of movement
   * from a src node to a destination node.
   *
   * @param _newCost New cost of movement
   */
  changeCost(_newCost: number): void {
    this.cost = _newCost;
  }

  /**
   * Function returns a string representation of this Edge.
   * The representation looks like :
   * src-----cost---->dest
   *
   * @returns a string representation of this Edge.
   */
  toString(): string {
    return `${this.src}---${this.cost}--->${this.dest}`;
  }
}
