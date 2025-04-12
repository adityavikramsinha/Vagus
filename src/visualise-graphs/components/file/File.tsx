import React from 'react';
export enum FileType {
    TS= "ts",
    IO = "io",
    BAT ="bat",
    SYS = "sys",
    MD = "md",
    GUI = "gui",
}


export type FileProps = {
    type ?: FileType,
    id : string,
    text : string,
    Icon : React.JSX.Element,
    changeSelectedFile ?: (divId:string, text:string, type:FileType)=> void
    currentActive ?: string
}

const File: React.FC<FileProps> = (props) => {

    return (
        <div
            style ={props.id===props.currentActive? {background : `rgba(255, 255, 255, 0.05)`}:{}}
            className= {`file ${props.type}-file`}
            id={props.id}
            onClick={() =>{
                if (props.type !== FileType.GUI)
                props.changeSelectedFile(props.id, props.text, props.type)
            }}
        >
            {props.Icon}
            <p className="file-name">{props.text}</p>
        </div>
    )
}
export default File;

