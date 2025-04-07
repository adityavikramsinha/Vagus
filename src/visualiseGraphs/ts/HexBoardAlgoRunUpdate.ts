import currentState from "./GlobalState";
import { nodeHoverAnimation } from "./HexBoardUpdate";
import { RemoveAllClasses } from './ActionButtonsFunctionality';
import { updateIDClass, extractIDs } from './Utility';
import { SpeedType } from "./Types";

export const updatePathNodes = (pathIDs: number[], i: number): void => {
  if (currentState.run() === false) return;
  setTimeout(() => {
    let [propsID, svgID] = extractIDs(pathIDs[i]);
    updateIDClass(propsID, ['no-node', 'visited-node', 'visited-node-bomb'], ['path-node']);
    updateIDClass(svgID, ['no-node', 'icon', 'svg-visited-node', 'svg-visited-node-bomb'], ['svg-path-node']);
    if (++i < pathIDs.length)
      updatePathNodes(pathIDs, i);
    if (i === pathIDs.length)
      currentState.changeRun();
  }, 50 * updateSpeed())
}

export const updateVisitedNodes = (visitedID1: number[], visitedID2: number[], pathIDs: number[], bomb: boolean, i: number): void => {
  if (currentState.run() === false) return;
  setTimeout(() => {
    let [propsID, svgID] = extractIDs(visitedID1[i]);
    if (!document.getElementById(svgID).classList.contains('svg-path-node')) {
      updateIDClass(propsID, ['no-node'], ['visited-node']);
      updateIDClass(svgID, ['no-node', 'icon'], ['svg-visited-node']);
      if (document.getElementById(propsID).classList.contains('weight-node'))
        nodeHoverAnimation(propsID);
      if (++i < visitedID1.length)
        updateVisitedNodes(visitedID1, visitedID2, pathIDs, bomb, i);
      else if (pathIDs === null || pathIDs.length === 0) {
        alert("No Path Found! :(");
        currentState.changeRun();
      }
      if (i === visitedID1.length && bomb)
        updateBombNode(visitedID2, pathIDs, 0);
      else if (i === visitedID1.length)
        updatePathNodes(pathIDs, 0);
    }
  }, 1 * updateSpeed())
}

export const updateBiDirectionalVisitedNodes = (visitedIDs: number[], pathIDs: number[], waitOrNoWait: boolean, i: number) => {
  if (currentState.run() === false) return;
  setTimeout(() => {
    let [propsID, svgID] = extractIDs(visitedIDs[i]);
    if (!document.getElementById(svgID).classList.contains('svg-path-node')) {
      updateIDClass(propsID, ['no-node'], ['visited-node']);
      updateIDClass(svgID, ['no-node', 'icon'], ['svg-visited-node']);
      if (document.getElementById(propsID).classList.contains('weight-node'))
        nodeHoverAnimation(propsID);
      if (++i < visitedIDs.length)
        updateBiDirectionalVisitedNodes(visitedIDs, pathIDs, waitOrNoWait, i);
      else if (pathIDs === null && waitOrNoWait) {
        alert("No Path Found! :(");
        currentState.changeRun();
      }
      else if (i === visitedIDs.length && waitOrNoWait)
        updatePathNodes(pathIDs, 0);
    }
  }, 1 * updateSpeed())
}

export const updateRandomVisitedNodes = (pathID: number): void => {
  if (currentState.run() === false) return;
  setTimeout(() => {
    let [propsID, svgID] = extractIDs(pathID);
    if (document.getElementById(svgID).classList.contains('svg-path-node')) {
      updateIDClass(propsID, ['path-node'], ['visited-node-bomb']);
      updateIDClass(svgID, ['svg-path-node'], ['svg-visited-node-bomb']);
      updateRandomVisitedNodes(pathID);
      return;
    }
    updateIDClass(propsID, ['no-node', 'visited-node', 'visited-node-bomb'], ['path-node']);
    updateIDClass(svgID, ['no-node', 'icon', 'svg-visited-node', 'svg-visited-node-bomb'], ['svg-path-node']);
  }, 50 * updateSpeed())
}

const updateBombNode = (visitedID2: number[], pathIDs: number[], i) => {
  if (currentState.run() === false) return;
  setTimeout(() => {
    let [propsID, svgID] = extractIDs(visitedID2[i]);
    if (!document.getElementById(svgID).classList.contains('svg-path-node')) {
      updateIDClass(propsID, ['no-node'], ['visited-node-bomb']);
      updateIDClass(svgID, ['no-node', 'icon'], ['svg-visited-node-bomb']);
      if (document.getElementById(propsID).classList.contains('weight-node'))
        nodeHoverAnimation(propsID);
      if (++i < visitedID2.length)
        updateBombNode(visitedID2, pathIDs, i);
      else if (pathIDs === null || pathIDs.length === 0) {
        alert("No Path Found! :(");
        currentState.changeRun();
      }
      else if (i === visitedID2.length)
        updatePathNodes(pathIDs, 0);
    }
  }, 1 * updateSpeed())
}

export const unUpdateNodes = (classToRemove: string, classToAdd: string) => {
  if (currentState.run() === true) return;
  let nodesSVG = document.querySelectorAll(`.svg-${classToRemove}`);
  for (let i = 0; i < nodesSVG.length; i++) {
    const ele = nodesSVG[i] as HTMLElement;
    ele.classList.remove(`svg-${classToRemove}`);
    ele.classList.add(`svg-${classToAdd}`);
  }
  let nodes = document.querySelectorAll(`.${classToRemove}`);
  for (let i = 0; i < nodes.length; i++) {
    const ele = nodes[i] as HTMLElement;
    ele.classList.remove(classToRemove);
    ele.classList.add(classToAdd);
  }
  setTimeout(() => { renewNodes(classToAdd) }, 1100)
}

const renewNodes = (classToRemove: string) => {
  if (currentState.run() === true) return
  let nodesSVG = document.querySelectorAll(`.svg-${classToRemove}`);
  for (let i = 0; i < nodesSVG.length; i++) {
    const ele = nodesSVG[i] as HTMLElement;
    ele.classList.remove(`svg-${classToRemove}`);
    ele.classList.add('icon', 'no-node');
  }
  let nodes = document.querySelectorAll(`.${classToRemove}`);
  for (let i = 0; i < nodes.length; i++) {
    const ele = nodes[i] as HTMLElement;
    ele.classList.remove(classToRemove);
    ele.classList.add('no-node');
  }
  RemoveAllClasses(1, []);
}

const updateSpeed = (): number => {
  switch (currentState.speed()) {
    case SpeedType.percent100:
      return 1;
    case SpeedType.percent50:
      return 2;
    case SpeedType.percent25:
      return 4;
  }
}