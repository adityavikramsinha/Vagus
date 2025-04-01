import {
  AlgoType,
  MazeGenerationType,
  NodeType,
  SpeedType
} from "./Types";
import Graph from "./Graph";



/**
 * This is the global head. The class is tasked and authorised to control
 * the State of all the functions and states present on the
 * Website.
 *
 * @author aditya , <adityavikramsinha19@gmail.com>
 */
class State<T> {

  // Current graph
  private PRES_GRAPH: Graph<T>;

  // Initialising graph.
  private INIT_GRAPH: Graph<T>;

  // State for the addable node folder
  private AddableNode: NodeType;

  // State for the runable algorithm
  private Algorithm: AlgoType;

  // State for the implementable maze
  private Maze: MazeGenerationType;

  // State for the executable speed.
  private Speed: SpeedType;

  // Start-node on the maze
  private StartNode: T;

  // End-node on the maze
  private EndNode: T;

  // Bomb node on the maze
  private BombNode: T;

  // Permission for execution
  private Run: boolean;

  // holds the global state for css settings.
  private CSSvariables: Map<string, string>;

  // all the identifiers ready to be mapped
  private CSSIdentifiers = [
    'solid-red',
    'light-red',
    'blue',
    'green',
    'yellow',
    'file-bg',
    'file-bg-selected',
    'file-border',
    'cmd-bg',
    'cmd-border',
    'project-bg',
    'moz-sb-color',
    'sb-color',
    'sb-color-hover',
    'sb-color-track',
    'file-hover',
    'algo-folder',
    'node-folder',
    'maze-folder',
    'speed-folder',
    'legend-folder',
    'hex-color',
    'hex-color-hover',
    'wall-node-color',
    'path-node-color-1',
    'path-node-color-2',
    'path-node-color-3',
    'path-node-color-4',
    'path-node-color-5',
    'visited-node-color-1',
    'visited-node-color-2',
    'visited-node-color-3',
    'visited-node-color-11',
    'visited-node-color-21',
    'visited-node-color31'
  ];

  // values of all the identifiers
  private CSSValues = [
    'EF5350',
    'D5756C',
    '67BBFF',
    '4CAF50',
    'E5C07B',
    '21252B',
    '4B4E5578',
    '67BBFF',
    '21252B',
    '434B57',
    '323844',
    '4B4E5578',
    'FFFFFF42',
    'FFFFFF60',
    '7F808200',
    '2C313A',
    'D5756C',
    '67BBFF',
    '4CAF50',
    'E5C07B',
    'EF5350',
    '282C34',
    '1B8BCD',
    '484E5B',
    'FFA500',
    'FF9000',
    'FF7B00',
    'FF6702',
    'FF5000',
    '175AB5',
    '1B8BCD',
    '25C8CF',
    'BF4286',
    'D15FDA',
    '85404F'
  ];

  /**
   * Constructs a graph will all values set to null.
   * Unless, the start , end and graph values are given.
   *
   * @param _start The start node of the maze
   * @param _end The end node of the maze
   * @param _graph The graph representation of the maze
   */
  constructor(_start: T = null, _end: T = null, _graph: Graph<T> = null) {
    this.AddableNode = null;
    this.Algorithm = null;
    this.Maze = MazeGenerationType.none;
    this.Speed = SpeedType.percent100;
    this.StartNode = _start;
    this.EndNode = _end;
    this.BombNode = null;
    this.INIT_GRAPH = _graph;
    this.PRES_GRAPH = _graph;
    this.Run = false;
    this.CSSvariables = new Map();

    // get the values of the identifiers
    // create a new Map;
    for (let i: number = 0; i < Math.min(this.CSSValues.length, this.CSSIdentifiers.length); i++)
      this.CSSvariables.set(this.CSSIdentifiers[i], this.CSSValues[i]);
  }

  /**
   *
   * @returns the graph representation of the HexBoard state.
   */
  graph(): Graph<T> { return this.PRES_GRAPH; }

  /**
   *
   * @returns the Initial graph representation of the HexBoard.
   */
  initGraph(): Graph<T> { return this.INIT_GRAPH; }

  /**
   *
   * @returns the addable node TYPe
   */
  addableNode(): NodeType { return this.AddableNode; }

  /**
   *
   * @returns the runable Algorithm type.
   */
  algorithm(): AlgoType { return this.Algorithm; }

  /**
   *
   * @returns the drawable maze pattern type
   */
  maze(): MazeGenerationType { return this.Maze; }

  /**
   *
   * @returns the executable speed type
   */
  speed(): SpeedType { return this.Speed; }

  /**
   *
   * @returns the start-node position ID of the HexBoard
   */
  startNode(): T { return this.StartNode; }

  /**
   *
   * @returns the end-node position ID of the HexBoard
   */
  endNode(): T { return this.EndNode; }

  /**
   *
   * @returns the bomb-node position ID of the HexBoard
   */
  bombNode(): T { return this.BombNode; }

  /**
   *
   * @returns run permission [true for running, false for not].
   */
  run(): boolean { return this.Run; }

  /**
   *
   * @returns the Map of Css variables in the form [identifier : value ]
   */
  cssVariables() : Map<string , string> { return this.CSSvariables ;  }

  /**
   * Updates the addable node state.
   *
   * @param toThis the state to be updated to
   */
  changeAddableNode(toThis: NodeType): void{
    this.AddableNode = toThis;
  }

  /**
   * Updates the algorithm state
   *
   * @param toThis the state to be updated to
   */
  changeAlgorithm(toThis: AlgoType): void{
    this.Algorithm = toThis;
  }

  /**
   * Updates the maze type
   *
   * @param toThis the state to be updated to
   */
  changeMaze(toThis: MazeGenerationType): void{
    this.Maze = toThis;
  }

  /**
   * Updates the speed type
   *
   * @param toThis the state to be updated to
   */
  changeSpeed(toThis: SpeedType): void{
    this.Speed = toThis;
  }

  /**
   * Updates the start-node ID
   *
   * @param toThis the state to be updated to
   */
  changeStartNode(toThis: T): void{
    this.StartNode = toThis;
  }

  /**
   * Updates the end-node ID
   *
   * @param toThis the state to be updated to
   */
  changeEndNode(toThis: T): void{
    this.EndNode = toThis;
  }

  /**
   * Updates the bomb-node ID
   *
   * @param toThis the state to be updated to
   */
  changeBombNode(toThis: T | null): void{
    this.BombNode = toThis;
  }

  /**
   * Updates the value of the present graph.
   *
   * @param toThis the state to be updated to
   */
  changeGraph(toThis: Graph<T>): void{
    this.PRES_GRAPH = toThis;
  }

  /**
   * Updates the value of the init graph
   *
   * @param toThis the state to be updated to
   */
  changeInitGraph(toThis: Graph<T>):void{
    this.INIT_GRAPH = toThis;
  }

  /**
   * Flips the run state.
   * If true, makes it to false.
   * If false, makes it to true.
   */
  changeRun() : void{
    this.Run = !this.Run;
  }

  /**
   * Changes the value of a CSS Variable identifier.
   * @param property the property of the identifier to be changed
   * @param identifier the name of the identifier
   * @param value the new value of that identifier
   * @returns true if there is a change, else false.
   */
  changeCSSVariable(property: string, identifier: string, value: string): boolean {

    // first check if css supports
    // if it does
    // return change and return true
    // else return false.
    this.CSSvariables.set(identifier.substring(2), value);
    if (!CSS.supports(property, value))
      return false;
    document.documentElement.style.setProperty(identifier, value);
    return true;
  }
}

// declaring the state variable internally so that
// it gets imported into every file using it
let currentState = new State<number>();

// declaring the pres graph
currentState.changeGraph(new Graph<number>((a, b): number => {
  return a === b ? 0 : a < b ? -1 : 1;
}));

// delcaring the init graph
currentState.changeInitGraph(new Graph<number>((a, b): number => {
  return a === b ? 0 : a < b ? -1 : 1;
}));

// in the beginning,both init and pres are the same graphs.
export default currentState;
