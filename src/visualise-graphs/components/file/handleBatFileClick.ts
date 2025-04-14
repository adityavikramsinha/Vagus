import {match} from "ts-pattern";
import {MazeType} from "../../ts/Types";
import MazeGenerator from "../../ts/MazeGenerator";
import {NodeAction, NodeType} from "../../store/FrontendStateManager";
import Syncer from "../../store/Syncer";

// FIXME: I am a slow-poke
/**
 * Handles the click of a File (specifically Bat) and then delegates the
 * Maze generation to a pattern matcher that systemically goes and tries to
 * generate each maze.
 * @param name name of the file without the extension to be compared with
 * the types
 * @param hexBoardDimensions dimensions of the hex board
 * @param changeNode call back function to change state
 * @param HEX_HEIGHT height of a node (pretty self-explanatory)
 * @param HEX_WIDTH width of a node (pretty self-explanatory)
 */
const handleBatFileClick = (
    name: string,
    hexBoardDimensions: { width: number, height: number },
    changeNode: (type: NodeType, action: NodeAction, id: number) => void,
    HEX_HEIGHT: number,
    HEX_WIDTH: number
) => {
    Syncer.cleanHexBoard();
    match(name as MazeType)
        .with(MazeType.GENERATE_BLOCKED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH)
            );
            maze.forEach(id => changeNode(NodeType.WALL_NODE, NodeAction.SET, id))
        })
        .with(MazeType.GENERATE_WEIGHTED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH)
            );
            maze.forEach(id => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
        })
        .with(MazeType.GENERATE_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            maze.forEach(id => changeNode((Math.floor(Math.random() * 2) & 1) == 1 ? NodeType.WALL_NODE : NodeType.WEIGHT_NODE, NodeAction.SET, id))
        })
        .with(MazeType.GENERATE_WEIGHTED_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            maze.forEach(id => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
        })
        .with(MazeType.GENERATE_BLOCKED_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            maze.forEach(id => changeNode(NodeType.WALL_NODE, NodeAction.SET, id))
        })
        .with(MazeType.GENERATE_LEAST_COST_PATH_BLOCKER_MAZE, () => {
            // TODO incomplete
        })
        .exhaustive()
}

export default handleBatFileClick;