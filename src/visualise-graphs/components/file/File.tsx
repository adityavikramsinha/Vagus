import React from 'react';
import useFrontendStateManager, {NodeAction, NodeType} from "../../api/FrontendStateManager";
import {match} from "ts-pattern";
import {MazeType} from "../../ts/Types";
import MazeGenerator from "../../ts/MazeGenerator";
import handleBatFileClick from "./handleBatFileClick";
import cn from "../../css/cn";

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
    const isActiveFile = useFrontendStateManager(state => state.activeFiles[type] === id);
    const changeActiveFiles = useFrontendStateManager(state => state.changeActiveFiles);
    const {
        HEX_WIDTH,
        HEX_HEIGHT
    } = useFrontendStateManager(state => state.hexDimensions)

    const handleFileClick = (id: string, type: FileType) => {
        changeActiveFiles(id, type);
        match(type)
            .with(FileType.BAT, ()=>handleBatFileClick(name.substring(0, name.lastIndexOf('.')), HEX_HEIGHT, HEX_WIDTH))
            .otherwise(()=>{})
    }

    let classes = cn({
        "file": true,
        "file-active" : isActiveFile
    })
    return (
        <div
            className={classes}
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

