import Algorithms from "./Algorithms";
import currentState from "./GlobalState";
import Graph from "./Graph";
import { updateBiDirectionalVisitedNodes, updateRandomVisitedNodes, updateVisitedNodes, unUpdateNodes } from "./HexBoardAlgoRunUpdate";
import { setInitialNodes } from "./HexBoardUpdate";
import { AlgoType } from "./Types";
import { updateIDClass } from './Utility';

/**
 * Sets the hex board to its default initial state when the Stop button is clicked.
 * Requires no parameters.
 * @return void
 */
const StopButtonClick = (): void => {
  if (currentState.run() === true) currentState.changeRun();
  updateIDClass('stop-button', [], ['button-clicked'])
  RemoveAllClasses(500, ['start-node', 'end-node', 'wall-node', 'weight-node', 'bomb-node']);
  currentState.changeBombNode(null);
  Graph.copy(currentState.initGraph(), currentState.graph(), 1);
  setTimeout(() => {
    updateIDClass('stop-button', ['button-clicked'], [])
    setInitialNodes();
  }, 510);
}

const StartButtonClick = (currentNode, running): void => {
  if (!running) {
    let remAlgo: AlgoType[] = [AlgoType.aStarSearch, AlgoType.bellmanFord, AlgoType.bestFirstSearch, AlgoType.breadthFirstSearch, AlgoType.depthFirstSearch, AlgoType.depthFirstSearch, AlgoType.dijkstrasSearch]
    if (currentState.algorithm() === null) alert('Please select an algorithm before continuing!');
    else if (currentState.algorithm() === AlgoType.biDirectionalSearch) {
      RemoveAllClasses(1, []);
      const [pathFromStart, visitedFromStartSet, visitedFromEndSet] = new Algorithms(currentState.graph()).biDirectional(currentState.startNode(), currentState.endNode());
      const visitedFromStartArray = Array.from(visitedFromStartSet);
      const visitedFromEndArray = Array.from(visitedFromEndSet);
      if (currentState.bombNode() != null)
        alert("BiDirectional Search cannot be used with a bomb node!");
      else if (visitedFromStartArray.length > visitedFromEndArray.length) {
        updateBiDirectionalVisitedNodes(visitedFromStartArray, pathFromStart, true, 0);
        updateBiDirectionalVisitedNodes(visitedFromEndArray, pathFromStart, false, 0);
      }
      else {
        updateBiDirectionalVisitedNodes(visitedFromStartArray, pathFromStart, false, 0);
        updateBiDirectionalVisitedNodes(visitedFromEndArray, pathFromStart, true, 0);
      }
    }
    else if (currentState.algorithm() === AlgoType.randomWalk && currentState.run()) {
      let endNode: number = currentState.endNode();
      setTimeout(() => {
        updateRandomVisitedNodes(currentNode.getData())
        let oldNode = currentNode;
        currentNode = currentNode.getRandomNeighbour()
        if (currentState.bombNode() != null)
          alert("Random Walk cannot be used with a bomb node!");
        else if (currentNode === oldNode)
          alert("No Path Found! :(");
        else if (currentNode.getData() !== endNode)
          StartButtonClick(currentNode, false);
        else if (currentNode.getData() === endNode)
          updateRandomVisitedNodes(endNode);
      }, 10)
    }
    else if (remAlgo.includes(currentState.algorithm())) {
      RemoveAllClasses(1, []);
      if (currentState.bombNode() === null) {
        let path: number[] = Algorithms.runAlgoFromGlobalStateNoBomb().path;
        let visitedInOrder: Set<number> = Algorithms.runAlgoFromGlobalStateNoBomb().visitedInOrder;
        let ids: number[] = Array.from(visitedInOrder.keys());
        updateVisitedNodes(ids, null, path, false, 0);
      }
      else {
        let path: number[] = Algorithms.runAlgorithmGlobalStateYesBomb().path;
        let visitedP1: Set<number> = Algorithms.runAlgorithmGlobalStateYesBomb().visitedP1;
        let visitedP2: Set<number> = Algorithms.runAlgorithmGlobalStateYesBomb().visitedP2;
        let ids1: number[] = Array.from(visitedP1.keys());
        let ids2: number[] = Array.from(visitedP2.keys());
        updateVisitedNodes(ids1, ids2, path, true, 0);
      }
    }
  }
  else {
    RemoveAllClasses(1, []);
    currentState.changeRun();
    setTimeout(() => {
      currentState.changeRun();
      StartButtonClick(currentNode, false);
    }, 250)
  }
}

const PrevButtonClick = (): void => {
  if (currentState.run() === true) currentState.changeRun();
  unUpdateNodes('path-node', 'un-path-node');
  unUpdateNodes('visited-node', 'un-visited-node');
  unUpdateNodes('visited-node-bomb', 'un-visited-bomb-node');
}

/**
 * Removes all the nodes of a certain type from the board.
 * @param node The class of the node type that has to be removed from the board.
 * @return void
 */
const RemoveAllNodes = (node: string): void => {
  let nodes = document.querySelectorAll(`.${node}`);
  let svgNode = document.querySelectorAll(`.svg-${node}`);
  for (let i = 0; i < nodes.length; i++) {
    const ele = nodes[i] as HTMLElement;
    ele.classList.remove(node, 'node-hover');
    ele.classList.add('no-node');
    const svgEle = svgNode[i] as HTMLElement;
    svgEle.classList.remove(`svg-${node}`);
    svgEle.classList.add('no-node', 'icon');
  }
}

const RemoveAllClasses = (time: number, optional: string[]) => {
  setTimeout(() => {
    RemoveAllNodes('path-node');
    RemoveAllNodes('visited-node');
    RemoveAllNodes('visited-node-bomb');
    RemoveAllNodes('un-path-node');
    RemoveAllNodes('un-visited-node');
    optional.forEach((x: string) => RemoveAllNodes(x));
  }, time)
}

export {
  StopButtonClick,
  StartButtonClick,
  PrevButtonClick,
  RemoveAllClasses,
}
