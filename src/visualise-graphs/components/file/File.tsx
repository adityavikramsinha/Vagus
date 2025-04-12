import React from 'react';
import useFrontendStateManager from "../../store/store";
export enum FileType {
    TS= "ts",
    IO = "io",
    BAT ="bat",
    SYS = "sys",
    MD = "md",
    GUI = "gui",
}

export type FileProps = {
    type : FileType,
    id : string,
    text : string,
    Icon : React.JSX.Element
}
// FIXME, SLOW ASF
const File: React.FC<FileProps> = ({type, id, text, Icon}) => {
    let isActiveFile = useFrontendStateManager(state=>state.activeFiles[type] ===id);
    const changeActiveFiles = useFrontendStateManager(state=>state.changeActiveFiles);

    // just handles the file click
    const handleFileClick = (id : string, type: FileType)=> changeActiveFiles(id , type)
    return (
        <div
            style ={isActiveFile? {background : `rgba(255, 255, 255, 0.05)`}:{}}
            className= "file"
            id={id}
            onClick={() =>{
                if (type !== FileType.GUI)
                handleFileClick(id,type)
            }}
        >
            {Icon}
            <p className="file-name">{text}</p>
        </div>
    )
}
export default File;

