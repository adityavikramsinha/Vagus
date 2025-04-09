import React from 'react';
/**
 * Starts the pulsating of the all the nodes of a particular type which is selected on the command board.
 * @param nodeType The type of node that is selected.
 */
export const updateAddableNodes = (nodeType: string) => {
    let files = document.querySelectorAll('.node-hover');
    for (let i = 0; i < files.length; i++) {
        const ele = files[i] as HTMLElement;
        ele.classList.remove('node-hover');
    }
    switch (nodeType) {
        case 'startNode':
            let startNode = document.querySelector<HTMLElement>('.start-node');

            // ensure that the starting node is set, because after [x] button
            // is pressed, start node is being removed from the canvas
            if(startNode!== null)
                startNode.classList.add('node-hover');
            break;
        case 'endNode':

            // ensure that the ending node is set, because after [x] button
            // is pressed, end node is being removed from the canvas
            let endNode = document.querySelector<HTMLElement>('.end-node');
            if(endNode!== null)
                endNode.classList.add('node-hover');
            break;
        case 'bombNode':

            // ensure that the bomb node is set
            let bombNode = document.querySelector<HTMLElement>('.bomb-node');
            if (bombNode !== null)
                document.querySelector<HTMLElement>('.bomb-node').classList.add('node-hover');
            break;
        case 'weightNode':
            if (document.querySelector<HTMLElement>('.weight-node')) {
                let files = document.querySelectorAll('.weight-node');
                for (let i = 0; i < files.length; i++) {
                    const ele = files[i] as HTMLElement;
                    ele.classList.add('node-hover');
                }
            }
            break;
        default:
            break;
    }
}

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

