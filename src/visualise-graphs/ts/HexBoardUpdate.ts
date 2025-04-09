import currentState from './GlobalState'
import Graph from "./Graph";
import { MazeGenerator } from './MazeGenerator';
import {AlgoType, MazeGenerationType, NodeType, SpeedType} from './Types';
import {removeAllClasses} from "./Utility";
import { updateIDClass, updateBiIDClass } from './Utility';
import {updateAddableNodes} from "../components/file/File";

const updateHexIcon = (propID: string, id: number): void => {
  document.onmousemove = null;
  document.onmousedown = null;
  updateStateOnClick(propID);
  switch (currentState.addableNode()) {
    case 'start-node':
      updateNode(propID, 'start-node');
      nodeHoverAnimation(propID);
      currentState.changeStartNode(id);
      break;
    case 'end-node':
      updateNode(propID, 'end-node');
      nodeHoverAnimation(propID);
      currentState.changeEndNode(id);
      break;
    case 'bomb-node':
      nodeHoverAnimation(propID);
      if (document.getElementById(propID).classList.contains('bomb-node')) {
        removeOnClick(propID, 'bomb-node', id);
        currentState.changeBombNode(null);
      }
      else {
        updateNode(propID, 'bomb-node');
        currentState.changeBombNode(id);
      }
      break;
    case 'weight-node':
      if (document.getElementById(propID).classList.contains('weight-node')) {
        removeOnClick(propID, 'weight-node', id);
      }
      else {
        nodeHoverAnimation(propID);
        multiNodeUpdate(propID, 'weight-node', ['no-node']);
      }
      break;
    case 'wall-node':
      if (document.getElementById(propID).classList.contains('wall-node')) {
        removeOnClick(propID, 'wall-node', id);
      }
      else {
        nodeHoverAnimation(propID);
        multiNodeUpdate(propID, 'wall-node', ['no-node', 'icon']);
      }
      break;
    default:
      break;
  }
}

const multiNodeUpdate = (propID: string, node: string, toRemove: Array<string>): void => {
  document.onmousemove = null;
  document.onmousedown = null;
  if (document.getElementById(propID).classList.contains('no-node')) {
    updateIDClass(propID, ['no-node'], [node])
    multiNodeGraphUpdate(node, Number(propID.substring(propID.lastIndexOf('-') + 1)), 10, false)
    let svgID = propID.replace('props', 'svg');
    toRemove.forEach(element => document.getElementById(svgID).classList.remove(element));
    updateIDClass(svgID, [], [`svg-${node}`])
    document.onmousedown = () => {
      document.onmousemove = (e) => {
        if (e.buttons === 1) {
          let svg = e.target as HTMLElement;
          if (svg.id.startsWith('svg')) {
            let SVG_ID = svg.id;
            let HoverPropsID = svg.id.replace('svg', 'props');
            if (document.getElementById(HoverPropsID).classList.contains('no-node')) {
              toRemove.forEach(element => document.getElementById(SVG_ID).classList.remove(element));
              updateIDClass(SVG_ID, [], [`svg-${node}`])
              updateIDClass(HoverPropsID, ['no-node'], [node])
              multiNodeGraphUpdate(node, Number(HoverPropsID.substring(HoverPropsID.lastIndexOf('-') + 1)), 10, false)
            }
            nodeHoverAnimation(HoverPropsID);
          }
        }
      }
    }
  }
}

const updateNode = (propID: string, node: string): void => {
  let svgID = propID.replace('props', 'svg');
  if (document.getElementById(propID).classList.contains('no-node')) {
    let files = document.querySelectorAll(`.${node}`);
    let svgFiles = document.querySelectorAll(`.svg-${node}`);
    for (let i = 0; i < files.length; i++) {
      const ele = files[i] as HTMLElement;
      ele.classList.remove(node);
      ele.classList.add('no-node');
      const svgEle = svgFiles[i] as HTMLElement;
      svgEle.classList.remove(`svg-${node}`);
      svgEle.classList.add('no-node');
    }
    updateIDClass(propID, ['no-node'], [node])
    updateIDClass(svgID, ['no-node'], [`svg-${node}`])
  }
}

const multiNodeGraphUpdate = (node: string, id: number, cost: number, add: boolean): void => {
  if (node === 'weight-node') currentState.graph().updateCostOfIncoming(id, cost);
  else if (node === 'wall-node') {
    if (add) Graph.revertNode(id, currentState.initGraph(), currentState.graph());
    else currentState.graph().rmNode(id);
  }
}


// TODO: still direct DOM manipulation
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
        ele.style.backgroundColor = "transparent";
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
    updateAddableNodes(textAdd);
    document.onmousemove = null;
    document.onmousedown = null;
}

const updateStateOnClick = (propID: string): void => {
  document.onmousemove = null;
  document.onmousedown = null;
  let ele = document.getElementById(propID)
  if (ele.classList.contains('start-node'))
    updateState('.io-file', 'io-1', 'startNode.io');
  else if (ele.classList.contains('end-node'))
    updateState('.io-file', 'io-2', 'endNode.io');
  else if (ele.classList.contains('bomb-node'))
    updateState('.io-file', 'io-3', 'bombNode.io');
  else if (ele.classList.contains('weight-node'))
    updateState('.io-file', 'io-4', 'weightNode.io');
  else if (ele.classList.contains('wall-node'))
    updateState('.io-file', 'io-5', 'wallNode.io');
}

const removeOnClick = (propID: string, nodeClass: string, id: number): void => {
  let svgID = propID.replace('props', 'svg');
  updateIDClass(propID, [nodeClass, 'node-hover'], ['no-node']);
  updateIDClass(svgID, [`svg-${nodeClass}`], ['no-node']);
  if (nodeClass === 'wall-node' || nodeClass === 'weight-node') {
    updateIDClass(svgID, [nodeClass], ['no-node', 'icon']);
    multiNodeGraphUpdate(nodeClass, id, 1, true);
  }
}

const nodeHoverAnimation = (propID: string): void => {
  let files = document.querySelectorAll('.node-hover');
  for (let i = 0; i < files.length; i++) {
    const ele = files[i] as HTMLElement;
    ele.classList.remove('node-hover');
  }
  files = document.querySelectorAll(`#${propID}`);
  for (let i = 0; i < files.length; i++) {
    const ele = files[i] as HTMLElement;
    ele.classList.add('node-hover');
  }
}

type displayMazeOptions = {
  randomMap?: Map<number, boolean>,
  mazeLeastCostArray?: number[],
  weightedRidges?: Set<number>[],
  weightedSet?: Set<number>,
  blockedSet?: Set<number>,
  blockedRidges?: Set<number>[]
}

const displayMaze = (options: displayMazeOptions): void => {
  if (currentState.maze() === MazeGenerationType.generateRandomMaze) {
    for (let [id, state] of options.randomMap) {
      if (state) updateBiIDClass(id, ['no-node', 'icon'], 'wall-node');
      else updateBiIDClass(id, ['no-node'], 'weight-node');;
    }
  }
  else if (currentState.maze() === MazeGenerationType.generateLeastCostPathBlocker)
    options.mazeLeastCostArray.forEach(id => updateBiIDClass(id, ['no-node', 'icon'], 'wall-node'));
  else if (currentState.maze() === MazeGenerationType.generateBlockedRidges)
    options.blockedRidges.forEach(ridge => ridge.forEach(id => updateBiIDClass(id, ['no-node', 'icon'], 'wall-node')));
  else if (currentState.maze() === MazeGenerationType.generateWeightedRidges)
    options.weightedRidges.forEach(ridge => ridge.forEach(id => updateBiIDClass(id, ['no-node'], 'weight-node')));
  else if (currentState.maze() === MazeGenerationType.generateWeightedRandomMaze)
    options.weightedSet.forEach(id => updateBiIDClass(id, ['no-node'], 'weight-node'));
  else if (currentState.maze() === MazeGenerationType.generateBlockedRandomMaze)
    options.blockedSet.forEach(id => updateBiIDClass(id, ['no-node', 'icon'], 'wall-node'));
}

const updateMaze = (): void => {
  if (currentState.run() === true) return;
  removeAllClasses(1, ['start-node', 'end-node', 'wall-node', 'weight-node']);
  Graph.copy(currentState.initGraph(), currentState.graph(), 1);
  setTimeout(() => {
    switch (currentState.maze()) {
      case MazeGenerationType.generateRandomMaze:
        let mazeMap: Map<number, boolean> = MazeGenerator.generateRandomMaze();
        displayMaze({ randomMap: mazeMap });
        break;
      case MazeGenerationType.generateWeightedRandomMaze:
        let mazeSet: Set<number> = MazeGenerator.generateRandomTypedMaze();
        displayMaze({ weightedSet: mazeSet });
        break;
      case MazeGenerationType.generateLeastCostPathBlocker:
        let mazeLeastPathBlocker: number[] = MazeGenerator.generateLeastCostPathBlocker();
        displayMaze({ mazeLeastCostArray: mazeLeastPathBlocker });
        break;
      case MazeGenerationType.generateBlockedRidges:
        let mazeGeneratedBlockedRidges: Set<number>[] = MazeGenerator.generateTypedRidges(false);
        displayMaze({ blockedRidges: mazeGeneratedBlockedRidges });
        break;
      case MazeGenerationType.generateBlockedRandomMaze:
        let blockedMazeSet: Set<number> = MazeGenerator.generateRandomTypedMaze(false);
        displayMaze({ blockedSet: blockedMazeSet });
        break;
      case MazeGenerationType.generateWeightedRidges:
        let mazeGeneratedWeightedRidges: Set<number>[] = MazeGenerator.generateTypedRidges(true);
        displayMaze({ weightedRidges: mazeGeneratedWeightedRidges });
        break;
      default:
        break;
    }
  }, 5);
}

export {
  updateHexIcon,
  nodeHoverAnimation,
  updateMaze,
}
