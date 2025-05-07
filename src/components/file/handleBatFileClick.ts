import { match } from 'ts-pattern';
import { MazeType } from '../../visualise-graphs/ts/Types';
import MazeGenerator from '../../visualise-graphs/api/MazeGenerator';
import useGraphStore, { NodeType } from '../../stores/GraphStore';
import Syncer from '../../visualise-graphs/api/Syncer';

/**
 * Handles the click of a File (specifically Bat) and then delegates the
 * Maze generation to a matcher that systemically goes and tries to
 * generate each maze.
 * @param type Of Maze to Generate.
 */
const handleBatFileClick = (type: MazeType) => {
    const hexBoardDimensions = useGraphStore.getState().hexBoardDimensions;
    const { HEX_WIDTH, HEX_HEIGHT } = useGraphStore.getState().hexDimensions;
    Syncer.clearHexBoard();
    match(type)
        .with(MazeType.GENERATE_BLOCKED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH),
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
            );
            const updatedHexBoard = { ...useGraphStore.getState().hexBoard };
            maze.forEach((id) => (updatedHexBoard[id] = NodeType.WALL_NODE));
            useGraphStore.setState({ hexBoard: updatedHexBoard });
        })
        .with(MazeType.GENERATE_WEIGHTED_RIDGES, () => {
            const maze = MazeGenerator.genRidges(
                Math.ceil(hexBoardDimensions.width / HEX_WIDTH),
                Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
            );
            const updatedHexBoard = { ...useGraphStore.getState().hexBoard };
            maze.forEach((id) => (updatedHexBoard[id] = NodeType.WEIGHT_NODE));
            useGraphStore.setState({ hexBoard: updatedHexBoard });
        })
        .with(MazeType.GENERATE_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const updatedHexBoard = { ...useGraphStore.getState().hexBoard };
            maze.forEach(
                (id) =>
                    (updatedHexBoard[id] =
                        (Math.floor(Math.random() * 2) & 1) == 1
                            ? NodeType.WALL_NODE
                            : NodeType.WEIGHT_NODE),
            );
            useGraphStore.setState({ hexBoard: updatedHexBoard });
        })
        .with(MazeType.GENERATE_WEIGHTED_RANDOM_MAZE, () => {
            const maze = MazeGenerator.genRandomMaze();
            const updatedHexBoard = { ...useGraphStore.getState().hexBoard };
            maze.forEach((id) => (updatedHexBoard[id] = NodeType.WEIGHT_NODE));
            useGraphStore.setState({ hexBoard: updatedHexBoard });
        })
        .with(MazeType.GENERATE_BLOCKED_RANDOM_MAZE, async () => {
            const maze = MazeGenerator.genRandomMaze();
            const updatedHexBoard = { ...useGraphStore.getState().hexBoard };
            maze.forEach((id) => (updatedHexBoard[id] = NodeType.WALL_NODE));
            useGraphStore.setState({ hexBoard: updatedHexBoard });
        })
        .exhaustive();
};

export default handleBatFileClick;
