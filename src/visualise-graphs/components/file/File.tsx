import React from 'react';
import useFrontendStateManager from "../../store/store";
import currentState from "../../ts/GlobalState";
import {
    AlgoType,
    MazeGenerationType,
    NodeType,
    SpeedType
} from "../../ts/Types";
import {updateMaze} from "../../ts/HexBoardUpdate";
import Settings from "../Settings";
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
const File: React.FC<FileProps> = (props) => {
    let isActiveFile = useFrontendStateManager(state=>state.isActiveFile(props.id , props.type));
    const changeActiveFiles = useFrontendStateManager(state=>state.changeActiveFiles);
    /**
     * Makes the changes in the Global States for the algorithm, node type, maze type, and speed.
     * Also makes the required the changes in the visual representation of the command board.
     * Sets the nodes to start pulsating depending on the selected node type.
     * @param type The type of file which is clicked
     * @param id The id of the file which is clicked.
     * @param text The type of file that is clicked.
     * @returns void
     */
    const handleSelectedFile = (id : string, text:string, type: FileType)=> {
        let typeOf: string = text.substring(0, text.lastIndexOf("."));
        switch (type) {
            case FileType.TS:
                currentState.changeAlgorithm(AlgoType[typeOf]);
                break;
            case FileType.IO:
                currentState.changeAddableNode(NodeType[typeOf]);
                break;
            case FileType.BAT:
                currentState.changeMaze(MazeGenerationType[typeOf]);
                updateMaze();
                break;
            case FileType.SYS:
                currentState.changeSpeed(parseInt(SpeedType[`percent${text.substring(0, text.indexOf('p'))}`]));
                break;
            case FileType.MD:
                Settings.toggleDisplay();
                break;
            default:
                return
        }
        changeActiveFiles(id , props.type)
    }
    return (
        <div
            style ={isActiveFile? {background : `rgba(255, 255, 255, 0.05)`}:{}}
            className= "file"
            id={props.id}
            onClick={() =>{
                if (props.type !== FileType.GUI)
                handleSelectedFile(props.id, props.text, props.type)
            }}
        >
            {props.Icon}
            <p className="file-name">{props.text}</p>
        </div>
    )
}
export default File;

