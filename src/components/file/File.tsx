import React from 'react';
import useGraphStore from "../../stores/GraphStore";
import {match} from "ts-pattern";
import handleBatFileClick from "./handleBatFileClick";
import cn from "../../visualise-graphs/css/cn";
import useFileExplorer from "../../providers/FileExplorer";

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
    Icon: React.JSX.Element,
    onClick ?: () => void
}

/**
 * @param type is the type of FileType
 * @param id id for keeping track of the active file.
 * @param name name of the file
 * @param Icon Icon depending on the extension (FileType)
 * @param OnClick Is a function that is to be executed when the File is Clicked,
 *                by default, when the file is clicked the function to be executed is related to the internal
 *                state and style of the file. But extra functionality can be added via the onClick function for
 *                specific files.
 */
const File: React.FC<FileProps> = ({type, id, name, Icon, onClick}) => {
    const isActiveFile = useFileExplorer((state : any)  => state.activeFiles[type] === id);
    const changeActiveFiles = useFileExplorer((state : any) => state.changeActiveFiles);
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
            onClick={()=>{
                if (type !== FileType.GUI)
                    changeActiveFiles(id, type);
                onClick?.();
            }}
            style={ isActiveFile ? styles : {}}
        >
            {Icon}
            <p className="file-name">{name}</p>
        </div>
    )
}
export default File;

