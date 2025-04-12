import currentState from "./GlobalState";
import Algorithms from "./Algorithms";
import Graph from "./Graph";

/**
 * The basic maze generator class which builds the Sets required for
 * drawing the maze on the website.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export class MazeGenerator {

  // Gets the number of rows which are present in the current
  // frame of reference.
  static workableRows: number;

  // Gets the number of columns which are present in the current
  // frame of reference
  static workableColumns: number;

  /**
   * static function to initialise all the properties
   * present in the class
   * @returns void
   */
  static setProps(): void {
    // this.workableRows = HexBoardInitializer.rows;
    // this.workableColumns = HexBoardInitializer.cols;
    this.workableRows = 100 ;
    this.workableColumns = 100;
  }

  /**
     * Generates a maze which has a column filled with walls or weights except for 2 psuedo random
     * hexes.
     * Does take care of the event in which a hex containing a bomb, start or end node is
     * assigned as a wall node.
     *
     * @param weighted boolean to show if the typed random maze will be weighted or not. Default is true.
     * @returns An array of Sets.
     * Each Set contains a collection of IDs for the nodes which
     * can be blocked or changed to wall nodes on the website
     */
  static generateTypedRidges(weighted:boolean =true): Set<number>[] | null {
    this.setProps();

    // first check for nullity case
    if (this.workableColumns < 2 || this.workableRows < 2) {
      return null;
    }

    // array to hold the "ridges"
    let ridges: Set<number>[] = [];
    // function which can be used to create 2 at random entry points for the path.
    function generateRandomEntries(colNo: number): { p1: number, p2: number } {
      let p1: number = Math.floor(Math.random() * (MazeGenerator.workableRows) + ( colNo * MazeGenerator.workableRows ) );
      let p2: number = p1 + 1;
      return {
        p1,
        p2
      }
    }

    //main loop which assigns the walls and entry points to the Array of Sets.
    for (let i: number = 0; i < this.workableColumns; i++) {
      let colRidge: Set<number> = new Set();
      if (i % 2 === 1 ) {
        let entryPoints = generateRandomEntries(i);
        for (let j: number = i * this.workableRows; j < this.workableRows * ( i + 1 ); j++) {
          if (j !== entryPoints.p1 && j !== entryPoints.p2 && j !== currentState.startNode() && j !== currentState.endNode() && j !== currentState.bombNode()) {
            colRidge.add(j);
          }
        }
        ridges.push(colRidge);
      }
    }

    Graph.copy(currentState.initGraph(), currentState.graph(), 1);

    ridges.forEach((ridgeCol) => {
      ridgeCol.forEach(nodeID => {
        if (weighted) {
          currentState.graph().updateCostOfIncoming(nodeID, 10);
        }
        else {
          currentState.graph().rmNode(nodeID);
        }
      });
    });
    return ridges;
  }

  /**
   * Generates a random maze with both a mixture of weights and walls.
   * It does take into consideration the IDs present in the StartNode, EndNode and BombNode entities.
   *
   * @returns
   * Returns a Map, the way to interpret the Map is that the keys contain the ID and,
   * the the boolean true or false represents the type of block.
   * A true represents a wall and a false represents a weight. The probability is psuedorandom.
   */
  static generateRandomMaze(): Map<number, boolean> {
    let path: Map<number, boolean> = new Map();
    for (let i = 0; i < currentState.graph().nodes().size - 5 ; i++) {
      let randomID = Math.floor(Math.random() * currentState.graph().nodes().size);
      if (randomID !== currentState.startNode() && randomID !== currentState.endNode() && randomID !== currentState.bombNode())
      path.set(randomID, false);
    }
    Graph.copy(currentState.initGraph(), currentState.graph(), 1);


    path.forEach((_, nodeID) => {
      let probability = Math.floor(Math.random() * 2);

      if (probability % 2 === 0) {
        //true then wall
        path.set(nodeID, true);
        currentState.graph().rmNode(nodeID);
      }

      else {
        // false then weight
        path.set(nodeID, false);
        currentState.graph().updateCostOfIncoming(nodeID, 10);
      }
    })
    return path;
  }

  /**
   * Generates a maze that blocks the least cost path in the grid
   *
   * @returns a Path which highlights the nodes to be blocked because they are part of the least cost path.
   */
  static generateLeastCostPathBlocker(): number[] {
    let algo = new Algorithms(currentState.graph());
    let path: number[] = [];

    if (currentState.bombNode() !== null) {
      let p1 = algo.dijkstras(currentState.startNode(), currentState.bombNode())[0];
      let p2 = algo.dijkstras(currentState.bombNode(), currentState.endNode())[0];

      if (p1 !== null && p2 !== null) {

        p1.forEach((nodeID) => {
          if (nodeID !== currentState.bombNode() && nodeID !== currentState.startNode())
            path.push(nodeID);
        });

        p2.forEach(nodeID => {
          if (nodeID !== currentState.bombNode() && nodeID !== currentState.endNode())
            path.push(nodeID);
        })

        path.forEach((nodeID) => currentState.graph().rmNode(nodeID));
      }
    }

    else {
      path = algo.dijkstras(currentState.startNode(), currentState.endNode())[0];
      if (path !== null) {
        path.pop();
        path.shift();
        path.forEach((nodeID) => currentState.graph().rmNode(nodeID));
      }
    }
    return path;
  }

  /**
   * Generates a random maze either filled with walls or weights.
   * It does take the start-node , bomb-node , end-node into consideration.
   *
   * @param weighted boolean to show if the typed random maze will be weighted or not. Default is true.
   * @returns a Set having the drawable IDs
   */
  static generateRandomTypedMaze(weighted : boolean = true): Set<number> {
    let path: Set<number> = new Set();
    for (let i = 0; i < currentState.graph().nodes().size - 5; i++) {
      let randomID = Math.floor(Math.random() * currentState.graph().nodes().size);
      if (randomID !== currentState.startNode() && randomID !== currentState.endNode() && randomID !== currentState.bombNode())
        path.add(randomID);
    }
    Graph.copy(currentState.initGraph(), currentState.graph(), 1);

    path.forEach(nodeID => {
      if (weighted) {
        currentState.graph().updateCostOfIncoming(nodeID, 10);
      }
      else {
        currentState.graph().rmNode(nodeID);
      }
    });
    return path;
  }
}
