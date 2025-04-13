import React from 'react';
import useStateManager, {NodeAction, NodeType} from "../../store/FrontendStateManager";
import {match} from "ts-pattern";
import {MazeType} from "../../ts/Types";
import MazeGenerator from "../../ts/MazeGenerator";
import handleBatFileClick from "./handleBatFileClick";

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

    const handleFileClick = (id: string, type: FileType) => {
        changeActiveFiles(id, type);
        match(type)
            .with(FileType.BAT, ()=>handleBatFileClick(name.substring(0, name.lastIndexOf('.')), {width : hexBoardDimensions.width, height: hexBoardDimensions.height}, changeNode, HEX_HEIGHT, HEX_WIDTH))
            .otherwise(()=>{})
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

