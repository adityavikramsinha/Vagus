import React from 'react';
import useFrontendStateManager from "@graph/api/FrontendStateManager";
import {match} from "ts-pattern";
import handleBatFileClick from "@graph/components/file/handleBatFileClick";
import cn from "@graph/css/cn";

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

/**
 * @param type is the type of FileType
 * @param id id for keeping track of the active file.
 * @param name name of the file
 * @param Icon Icon depending on the extension (FileType)
 */
const File: React.FC<FileProps> = ({type, id, name, Icon}) => {
    const isActiveFile = useFrontendStateManager(state => state.activeFiles[type] === id);
    const changeActiveFiles = useFrontendStateManager(state => state.changeActiveFiles);
    const {
        HEX_WIDTH,
        HEX_HEIGHT
    } = useFrontendStateManager(state => state.hexDimensions)

    const handleFileClick = () => {
        if (type === FileType.GUI) return;
        changeActiveFiles(id, type);
        match(type)
            .with(FileType.BAT,
                () => handleBatFileClick(name.substring(0, name.lastIndexOf('.')), HEX_HEIGHT, HEX_WIDTH))
            .otherwise(() => {
            })
    }

    let classes = cn({
        "file": true,
    })
    let styles: React.CSSProperties = {
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "4px"
    }
    return (
        <div
            className={classes}
            id={id}
            onClick={handleFileClick}
            style={ isActiveFile ? styles : {}}
        >
            {Icon}
            <p className="file-name">{name}</p>
        </div>
    )
}
export default File;

