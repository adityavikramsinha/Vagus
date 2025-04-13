import React from 'react';
import useStateManager, {NodeAction, NodeType} from "../../store/store";
import {match} from "ts-pattern";
import {MazeGenerationType} from "../../ts/Types";
import MazeGenerator from "../../ts/MazeGenerator";

export enum FileType {
    TS = "ts",
    IO = "io",
    BAT = "bat",
    SYS = "sys",
    MD = "md",
    GUI = "gui",
}

export type FileProps = {
    type: FileType,
    id: string,
    name: string,
    Icon: React.JSX.Element
}
// FIXME, SLOW ASF
const File: React.FC<FileProps> = ({type, id, name, Icon}) => {
    const isActiveFile = useStateManager(state => state.activeFiles[type] === id);
    const hexBoardDimensions = useStateManager(state => state.hexBoardDimensions);
    const changeActiveFiles = useStateManager(state => state.changeActiveFiles);
    const changeNode = useStateManager(state => state.changeNode)
    const {
        HEX_WIDTH,
        HEX_HEIGHT
    } = useStateManager(state => state.hexDimensions)
    // just handles the file click
    const handleFileClick = (id: string, type: FileType) => {
        changeActiveFiles(id, type);
        if (type === FileType.BAT) {
            match(name.substring(0, name.lastIndexOf('.')))
                .with(MazeGenerationType.GENERATE_BLOCKED_RIDGES, () => {
                    const maze = MazeGenerator.genRidges(
                        Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
                        Math.ceil(hexBoardDimensions.width / HEX_WIDTH)
                    );
                    maze.forEach(id => changeNode(NodeType.WALL_NODE, NodeAction.SET, id))
                })
                .with(MazeGenerationType.GENERATE_WEIGHTED_RIDGES, () => {
                    const maze = MazeGenerator.genRidges(
                        Math.ceil(hexBoardDimensions.height / HEX_HEIGHT),
                        Math.ceil(hexBoardDimensions.width / HEX_WIDTH)
                    );
                    maze.forEach(id => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
                })
                .with(MazeGenerationType.GENERATE_RANDOM_MAZE, () => {
                    const maze = MazeGenerator.genRandomMaze();
                    maze.forEach(id => changeNode((Math.floor(Math.random() * 2) & 1) == 1 ? NodeType.WALL_NODE : NodeType.WEIGHT_NODE, NodeAction.SET, id))
                })
                .with(MazeGenerationType.GENERATE_WEIGHTED_RANDOM_MAZE, () => {
                    const maze = MazeGenerator.genRandomMaze();
                    maze.forEach(id => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
                })
                .with(MazeGenerationType.GENERATE_BLOCKED_RANDOM_MAZE, () => {
                    const maze = MazeGenerator.genRandomMaze();
                    maze.forEach(id => changeNode(NodeType.WALL_NODE, NodeAction.SET, id))
                })
                .otherwise(() => ({}))
        }
    }
    return (
        <div
            style={isActiveFile ? {background: `rgba(255, 255, 255, 0.05)`} : {}}
            className="file"
            id={id}
            onClick={() => {
                if (type !== FileType.GUI)
                    handleFileClick(id, type)
            }}
        >
            {Icon}
            <p className="file-name">{name}</p>
        </div>
    )
}
export default File;

