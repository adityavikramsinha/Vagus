/**
 * Contains the algo-types for the website
 */
export enum AlgoType {
  dijkstrasSearch = "dijkstras-algo",
  aStarSearch = 'a*-algo',
  bellmanFord = 'bellmanFord-algo',
  breadthFirstSearch = 'bfs-algo',
  depthFirstSearch = 'dfs-algo',
  biDirectionalSearch = 'bd-algo',
  randomWalk = 'rand-algo',
  bestFirstSearch = 'best-fs'
}

export const NOTSET = Symbol("__NOTSET__");
export type NOTSET_TYPE = typeof NOTSET

/**
 * Contains the maze generation types for the website
 */
export enum MazeGenerationType {
  GENERATE_RANDOM_MAZE                  = 'generateRandomMaze',
  GENERATE_LEAST_COST_PATH_BLOCKER_MAZE = 'generateLeastCostPathBlockerMaze',
  GENERATE_WEIGHTED_RIDGES              = 'generateWeightedRidges',
  GENERATE_BLOCKED_RIDGES               = 'generateBlockedRidges' ,
  GENERATE_WEIGHTED_RANDOM_MAZE         = 'generateWeightedRandomMaze',
  GENERATE_BLOCKED_RANDOM_MAZE          = 'generateBlockedRandomMaze'
}

/**
 * Contains the SpeedTypes for the website
 */
export enum SpeedType {
  percent100 = 100,
  percent50 = 50,
  percent25 = 25
}
