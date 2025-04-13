import React from "react";
import Node from "../../ts/Node";
import currentState from "../../ts/GlobalState";
import {removeAllClasses} from "../../ts/Utility";
import {AlgoType, NOTSET, NOTSET_TYPE} from "../../ts/Types";
import Algorithms from "../../ts/Algorithms";
import {
    updateBiDirectionalVisitedNodes,
    updateRandomVisitedNodes,
    updateVisitedNodes
} from "../../ts/HexBoardAlgoRunUpdate";
import Button from "./Button";
import useStateManager, {NodeType} from "../../store/FrontendStateManager";
import Syncer from "../../store/Syncer";


const StartButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" id="run-button"
             className="button" {...props}>
            <path
                d="M13.75 7.20096C14.75 7.77831 14.75 9.22169 13.75 9.79904L7 13.6962C6 14.2735 4.75 13.5518 4.75 12.3971L4.75 4.60288C4.75 3.44818 6 2.7265 7 3.30385L13.75 7.20096Z"
                fill="#00FF2F"/>
        </svg>
    )
}


const startButtonClick = (
    currentNode: Node<number>,
): void => {
    if (!useStateManager.getState().block) {
        let remAlgo: AlgoType[] = [AlgoType.A_STAR_SEARCH, AlgoType.BELLMAN_FORD, AlgoType.BEST_FIRST_SEARCH, AlgoType.BREADTH_FIRST_SEARCH, AlgoType.DEPTH_FIRST_SEARCH, AlgoType.DEPTH_FIRST_SEARCH, AlgoType.DIJKSTRAS_SEARCH]
        if (useStateManager.getState().activeFiles.ts === NOTSET) {
            alert('Please select an algorithm before continuing!');
            return;
        } else if (useStateManager.getState().startNodeId === NOTSET) {
            alert('Please select a starting node');
            return;
        } else if (useStateManager.getState().endNodeId === NOTSET) {
            alert('Please select a ending node');
            return;
        }
        // I guess we have to now update the graph.
        for (const [nodeKey, nodeType] of Object.entries(useStateManager.getState().hexBoard)) {
            const id = Number(nodeKey);
            if (nodeType === NodeType.WALL_NODE)
                Syncer.removeNode(id);
            else if (nodeType === NodeType.WEIGHT_NODE) {
                const srcNode = currentState.graph().nodes().get(id);
                srcNode.getAdjNodes().forEach(edge => Syncer.updateEdge(edge.dest.getData(), id));
            }
        }
        if (useStateManager.getState().activeFiles.ts === AlgoType.BI_DIRECTIONAL_SEARCH) {
            removeAllClasses(1, []);
            const [pathFromStart, visitedFromStartSet, visitedFromEndSet] = new Algorithms(
                currentState.graph()).biDirectional(useStateManager.getState().startNodeId,
                                                    useStateManager.getState().endNodeId);
            const visitedFromStartArray = Array.from(visitedFromStartSet);
            const visitedFromEndArray = Array.from(visitedFromEndSet);
            if (useStateManager.getState().bombNodeId !== NOTSET)
                alert("BiDirectional Search cannot be used with a bomb node!");
            else if (visitedFromStartArray.length > visitedFromEndArray.length) {
                updateBiDirectionalVisitedNodes(visitedFromStartArray, pathFromStart, true, 0);
                updateBiDirectionalVisitedNodes(visitedFromEndArray, pathFromStart, false, 0);
            } else {
                updateBiDirectionalVisitedNodes(visitedFromStartArray, pathFromStart, false, 0);
                updateBiDirectionalVisitedNodes(visitedFromEndArray, pathFromStart, true, 0);
            }
        } else if (useStateManager.getState().activeFiles.ts === AlgoType.RANDOM_WALK && currentState.run()) {
            let endNode: number | NOTSET_TYPE = useStateManager.getState().endNodeId;
            updateRandomVisitedNodes(currentNode.getData())
            let oldNode = currentNode;
            currentNode = currentNode.getRandomNeighbour()
            if (currentState.bombNode() != null)
                alert("Random Walk cannot be used with a bomb node!");
            else if (currentNode === oldNode)
                alert("No Path Found! :(");
            else if (currentNode.getData() !== endNode)
                startButtonClick(currentNode);
            else if (currentNode.getData() === endNode)
                updateRandomVisitedNodes(endNode);
        } else if (remAlgo.includes(useStateManager.getState().activeFiles.ts)) {
            removeAllClasses(1, []);
            if (useStateManager.getState().bombNodeId === NOTSET) {
                let path: number[] = Algorithms.runAlgoFromGlobalStateNoBomb().path;
                let visitedInOrder: Set<number> = Algorithms.runAlgoFromGlobalStateNoBomb().visitedInOrder;
                let ids: number[] = Array.from(visitedInOrder.keys());
                updateVisitedNodes(ids, null, path, false, 0);
            } else {
                let path: number[] = Algorithms.runAlgorithmGlobalStateYesBomb().path;
                let visitedP1: Set<number> = Algorithms.runAlgorithmGlobalStateYesBomb().visitedP1;
                let visitedP2: Set<number> = Algorithms.runAlgorithmGlobalStateYesBomb().visitedP2;
                let ids1: number[] = Array.from(visitedP1.keys());
                let ids2: number[] = Array.from(visitedP2.keys());
                updateVisitedNodes(ids1, ids2, path, true, 0);
            }
        }
    } else {
        removeAllClasses(1, []);
        currentState.changeRun();
        setTimeout(() => {
            currentState.changeRun();
            startButtonClick(currentNode);
        }, 250)
    }
}

const StartButton = () => {

    return (
        <Button className="button" id="start-button" onClick={() => {
            let currentNode: Node<number> = currentState.graph().nodes().get(currentState.startNode())
            removeAllClasses(1, []);
            if (currentState.run()) startButtonClick(currentNode);
            else if (!currentState.run()) {
                currentState.changeRun();
                startButtonClick(currentNode)
            }
        }}>
            <StartButtonIcon/>
        </Button>
    )
}


export default StartButton

