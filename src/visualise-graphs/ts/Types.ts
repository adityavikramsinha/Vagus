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
  BEST_FIRST_SEARCH = 'best-fs'
}

export const NOTSET = Symbol("__NOTSET__");
export type NOTSET_TYPE = typeof NOTSET

/**
 * Contains the maze generation types for the website
 */
export enum MazeType {
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
