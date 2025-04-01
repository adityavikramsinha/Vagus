import React from 'react';
import '../css/navbar.css';
import {
  BATIcon,
  BOMBNode,
  ENDNode,
  IOIcon,
  MDIcon,
  SHORTESTPATHNode,
  STARTNode,
  SYSIcon,
  TSXIcon,
  UNVISITEDNode,
  VISITEDNode,
  WALLNode,
  WEIGHTNode
} from "../svgIcons/fileSVGIconComponent";
import currentState from "./GlobalState";
import { AlgoType, MazeGenerationType, NodeType, SpeedType } from "./Types";
import { updateMaze } from "./HexBoardUpdate"
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
  document.getElementById(id).style.backgroundColor = `#${currentState.cssVariables().get('file-bg-selected')}`;
  document.getElementById(id).style.borderLeft = `2.5px solid #${currentState.cssVariables().get('file-border')}`;
  let ext: string = text.substring(text.lastIndexOf(".") + 1);
  let textAdd: string = text.substring(0, text.lastIndexOf("."));
  switch (ext) {
    case "tsx":
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
      document.querySelector<HTMLElement>('.start-node').classList.add('node-hover');
      break;
    case 'endNode':
      document.querySelector<HTMLElement>('.end-node').classList.add('node-hover');
      break;
    case 'bombNode':
      if (document.querySelector<HTMLElement>('.bomb-node'))
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

export function TSXFile(props: any) {
  return (
    <div className={props.divClassName} id={props.divID} onClick={() => updateState('.tsx-file', props.divID, props.text)}>
      <TSXIcon />
      <p className={props.pClassName}>{props.text}</p>
    </div>
  )
}

export function IOFile(props: any) {
  return (
    <div className={props.divClassName} id={props.divID} onClick={() => updateState('.io-file', props.divID, props.text)}>
      <IOIcon />
      <p className={props.pClassName}>{props.text}</p>
    </div>
  )
}

export function BATFile(props: any) {
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

export function SYSFile(props: any) {
  return (
    <div className={props.divClassName} id={props.divID} onClick={() => updateState('.sys-file', props.divID, props.text)}>
      <SYSIcon />
      <p className={props.pClassName}>{props.text}</p>
    </div>
  )
}

export function MDFile(props: any) {
  return (
    <div className={props.divClassName} id={props.divID}  onClick={() => {
      Settings.toggleDisplay();
    }}>
      <MDIcon />
      <p className={props.pClassName}>{props.text}</p>
    </div>
  )
}

export function GUIFile(props: any) {
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

