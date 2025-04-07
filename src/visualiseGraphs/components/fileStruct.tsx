import React from 'react';
import {
    BATIcon,
    BOMBNode,
    ENDNode,
    IOIcon,
    MDIcon,
    SHORTESTPATHNode,
    STARTNode,
    SYSIcon,
    TsIcon,
    UNVISITEDNode,
    VISITEDNode,
    WALLNode,
    WEIGHTNode
} from "./fileSVGIconComponent";
import currentState from "../ts/GlobalState";
import { AlgoType, MazeGenerationType, NodeType, SpeedType } from "../ts/Types";
import { updateMaze } from "../ts/HexBoardUpdate"
import Settings from './Settings';

/**
 * Makes the changes in the Global States for the algorithm, node type, maze type, and speed.
 * Also makes the required the changes in the visual representation of the command board.
 * Sets the nodes to start pulsating depending on the selected node type.
 * @param divClass The class of the type of file which is clicked.
 * @param id The id of the file which is clicked.
 * @param text The type of file that is clicked.
 * @returns void
 */
export const updateState = (divClass: string, id: string, text: string): void => {
    let files = document.querySelectorAll(divClass);
    for (let i = 0; i < files.length; i++) {
        const ele = files[i] as HTMLElement;
        ele.style.backgroundColor = `#${ currentState.cssVariables().get('file-bg') }`;
        ele.style.borderLeft = "";
    }
    document.getElementById(id).style.backgroundColor = `rgba(255, 255, 255, 0.05)`;
    let ext: string = text.substring(text.lastIndexOf(".") + 1);
    let textAdd: string = text.substring(0, text.lastIndexOf("."));
    switch (ext) {
        case "ts":
            currentState.changeAlgorithm(AlgoType[textAdd]);
            break;
        case "io":
            currentState.changeAddableNode(NodeType[textAdd]);
            break;
        case "bat":
            currentState.changeMaze(MazeGenerationType[textAdd]);
            break;
        case "sys":
            currentState.changeSpeed(parseInt(SpeedType[`percent${text.substring(0, text.indexOf('p'))}`]));
            break;
        default:
            return
    }
    NodeAnimation(textAdd);
    document.onmousemove = null;
    document.onmousedown = null;
}


/**
 * Starts the pulsating of the all the nodes of a particular type which is selected on the command board.
 * @param nodeType The type of node that is selected.
 */
const NodeAnimation = (nodeType: string) => {
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

export const TsFile = (props: any) => {
    return (
        <div className={props.divClassName} id={props.divID} onClick={() => updateState('.ts-file', props.divID, props.text)}>
            <TsIcon />
            <p className={props.pClassName}>{props.text}</p>
        </div>
    )
}

export const IOFile = (props: any) => {
    return (
        <div className={props.divClassName} id={props.divID} onClick={() => updateState('.io-file', props.divID, props.text)}>
            <IOIcon />
            <p className={props.pClassName}>{props.text}</p>
        </div>
    )
}

export const BATFile =(props: any)=> {
    return (
        <div className={props.divClassName} id={props.divID} onClick={() => {
            updateState('.bat-file', props.divID, props.text);
            updateMaze();
        }
        }>
            <BATIcon />
            <p className={props.pClassName}>{props.text}</p>
        </div>
    )
}

export const SYSFile =(props: any) => {
    return (
        <div className={props.divClassName} id={props.divID} onClick={() => updateState('.sys-file', props.divID, props.text)}>
            <SYSIcon />
            <p className={props.pClassName}>{props.text}</p>
        </div>
    )
}

export const MDFile =(props: any) => {
    return (
        <div className={props.divClassName} id={props.divID}  onClick={() => {
            Settings.toggleDisplay();
        }}>
            <MDIcon />
            <p className={props.pClassName}>{props.text}</p>
        </div>
    )
}

export const GUIFile=(props: any) =>{
    function Icon() {
        switch (props.type) {
            case 'bomb': return <BOMBNode />;
            case 'shortest-path': return <SHORTESTPATHNode />;
            case 'wall': return <WALLNode />;
            case 'visited': return <VISITEDNode />;
            case 'unvisited': return <UNVISITEDNode />;
            case 'start-node': return <STARTNode />;
            case 'end-node': return <ENDNode />;
            case 'weight': return <WEIGHTNode />;
        }
    }
    return (
        <div className={props.divClassName} id={props.divID}>
            <Icon />
            <p className={props.pClassName}>{props.text}</p>
        </div>
    )
}

