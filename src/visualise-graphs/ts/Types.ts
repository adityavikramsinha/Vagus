import Edge from "./Edge";
import Graph from "./Graph";

/**
 * Contains the algo-types for the website
 */
export enum AlgoType {
  DIJKSTRAS_SEARCH = "dijkstras-algo",
  A_STAR_SEARCH = 'a*-algo',
  BELLMAN_FORD = 'bellmanFord-algo',
  BREADTH_FIRST_SEARCH = 'bfs-algo',
  DEPTH_FIRST_SEARCH = 'dfs-algo',
  BI_DIRECTIONAL_SEARCH = 'bd-algo',
  RANDOM_WALK = 'rand-algo',
  BEST_FIRST_SEARCH = 'best-fs',
  ZERO_ONE_BREADTH_FIRST_SEARCH = '0-1-bfs'
}

export const NOTSET: unique symbol  = Symbol("__NOTSET__") ;
export type NOTSET_t = typeof NOTSET;

export type AlgorithmApiReturn_t = [string[] | NOTSET_t, Set<string>];
export type AlgorithmApiInputs_t = {
  graph : Graph,
  startNodeId : string,
  endNodeId : string,
  nodeAction : (nodeId : string) => void,
  edgeAction : (edge : Edge) => void
}
/**
 * Contains the maze generation types for the website
 */
export enum MazeType {
  GENERATE_RANDOM_MAZE                  = 'generateRandomMaze',
  GENERATE_WEIGHTED_RIDGES              = 'generateWeightedRidges',
  GENERATE_BLOCKED_RIDGES               = 'generateBlockedRidges' ,
  GENERATE_WEIGHTED_RANDOM_MAZE         = 'generateWeightedRandomMaze',
  GENERATE_BLOCKED_RANDOM_MAZE          = 'generateBlockedRandomMaze'
}
