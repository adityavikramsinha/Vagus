import {match} from "ts-pattern";
import {MazeType} from "@graph/ts/Types";
import MazeGenerator from "@graph/ts/MazeGenerator";
import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import Syncer from "@graph/api/Syncer";

/**
 * Handles the click of a File (specifically Bat) and then delegates the
 * Maze generation to a pattern matcher that systemically goes and tries to
 * generate each maze.
 * @param name name of the file without the extension to be compared with
 * the types
 * @param HEX_HEIGHT height of a node (pretty self-explanatory)
 * @param HEX_WIDTH width of a node (pretty self-explanatory)
 */
const handleBatFileClick = (
    name: string,
    HEX_HEIGHT: number,
    HEX_WIDTH: number
) => {
    let hexBoardDimensions = useFrontendStateManager.getState().hexBoardDimensions;
    Syncer.clearHexBoard();
    match(name as MazeType)
        .with(MazeType.GENERATE_BLOCKED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH)
            );
            const hexBoard = useFrontendStateManager.getState().hexBoard;
            maze.forEach(id => hexBoard[id] = NodeType.WALL_NODE)
        })
        .with(MazeType.GENERATE_WEIGHTED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH)
            );
            const hexBoard = useFrontendStateManager.getState().hexBoard;
            maze.forEach(id => hexBoard[id] = NodeType.WEIGHT_NODE) // Changed to use direct hexBoard update
        })
        .with(MazeType.GENERATE_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const hexBoard = useFrontendStateManager.getState().hexBoard;
            maze.forEach(id => hexBoard[id] = (Math.floor(
                Math.random() * 2) & 1) == 1 ? NodeType.WALL_NODE : NodeType.WEIGHT_NODE)
        })
        .with(MazeType.GENERATE_WEIGHTED_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const hexBoard = useFrontendStateManager.getState().hexBoard;
            maze.forEach(id => hexBoard[id] = NodeType.WEIGHT_NODE) // Changed to use direct hexBoard update
        })
        .with(MazeType.GENERATE_BLOCKED_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const hexBoard = useFrontendStateManager.getState().hexBoard;
            maze.forEach(id => hexBoard[id] = NodeType.WALL_NODE) // Changed to use direct hexBoard update
        })
        .with(MazeType.GENERATE_LEAST_COST_PATH_BLOCKER_MAZE, () => {
            // TODO incomplete
        })
        .exhaustive()
}

export default handleBatFileClick;