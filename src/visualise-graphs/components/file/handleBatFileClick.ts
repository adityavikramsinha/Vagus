import {match} from "ts-pattern";
import {MazeType} from "@graph/ts/Types";
import MazeGenerator from "../../api/MazeGenerator";
import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import Syncer from "@graph/api/Syncer";

/**
 * Handles the click of a File (specifically Bat) and then delegates the
 * Maze generation to a matcher that systemically goes and tries to
 * generate each maze.
 * @param type Of Maze to Generate.
 */
const handleBatFileClick = (
    type: MazeType
) => {
    const hexBoardDimensions = useFrontendStateManager.getState().hexBoardDimensions;
    const {HEX_WIDTH, HEX_HEIGHT} = useFrontendStateManager.getState().hexDimensions;
    Syncer.clearHexBoard();
    match(type)
        .with(MazeType.GENERATE_BLOCKED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH),
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT)
            );
            const updatedHexBoard = {...useFrontendStateManager.getState().hexBoard};
            maze.forEach(id => updatedHexBoard[id] = NodeType.WALL_NODE)
            useFrontendStateManager.setState({hexBoard : updatedHexBoard});
        })
        .with(MazeType.GENERATE_WEIGHTED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH),
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT)
            );
            const updatedHexBoard = {...useFrontendStateManager.getState().hexBoard};
            maze.forEach(id => updatedHexBoard[id] = NodeType.WEIGHT_NODE)
            useFrontendStateManager.setState({hexBoard : updatedHexBoard});
        })
        .with(MazeType.GENERATE_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const updatedHexBoard = {...useFrontendStateManager.getState().hexBoard};
            maze.forEach(id => updatedHexBoard[id] = (Math.floor(
                Math.random() * 2) & 1) == 1 ? NodeType.WALL_NODE : NodeType.WEIGHT_NODE)
            useFrontendStateManager.setState({hexBoard : updatedHexBoard});
        })
        .with(MazeType.GENERATE_WEIGHTED_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const updatedHexBoard = {...useFrontendStateManager.getState().hexBoard};
            maze.forEach(id => updatedHexBoard[id] = NodeType.WEIGHT_NODE);
            useFrontendStateManager.setState({hexBoard : updatedHexBoard});
        })
        .with(MazeType.GENERATE_BLOCKED_RANDOM_MAZE, async () => {
            const maze = MazeGenerator.genRandomMaze();
            const updatedHexBoard = {...useFrontendStateManager.getState().hexBoard};
            maze.forEach(id => updatedHexBoard[id] = NodeType.WALL_NODE);
            useFrontendStateManager.setState({hexBoard : updatedHexBoard});
        })
        .exhaustive()
}

export default handleBatFileClick;