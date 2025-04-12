import React from "react";
import Node from "../../ts/Node";
import currentState from "../../ts/GlobalState";
import {removeAllClasses} from "../../ts/Utility";
import {AlgoType} from "../../ts/Types";
import Algorithms from "../../ts/Algorithms";
import {
    updateBiDirectionalVisitedNodes,
    updateRandomVisitedNodes,
    updateVisitedNodes
} from "../../ts/HexBoardAlgoRunUpdate";
import Button from "./Button";


const StartButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" id = "run-button" className ="button" {...props}>
            <path d="M13.75 7.20096C14.75 7.77831 14.75 9.22169 13.75 9.79904L7 13.6962C6 14.2735 4.75 13.5518 4.75 12.3971L4.75 4.60288C4.75 3.44818 6 2.7265 7 3.30385L13.75 7.20096Z" fill="#00FF2F"/>
        </svg>
    )
}


const startButtonClick = (currentNode: Node<number>, running: boolean): void => {
    if (!running) {
        let remAlgo: AlgoType[] = [AlgoType.aStarSearch, AlgoType.bellmanFord, AlgoType.bestFirstSearch, AlgoType.breadthFirstSearch, AlgoType.depthFirstSearch, AlgoType.depthFirstSearch, AlgoType.dijkstrasSearch]
        if (currentState.algorithm() === null) alert('Please select an algorithm before continuing!');
        else if( currentState.startNode () === null) alert ('Please select a starting node');
        else if (currentState.endNode () === null ) alert ('Please select a ending node');
        else if (currentState.algorithm() === AlgoType.biDirectionalSearch) {
            removeAllClasses(1, []);
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
                    startButtonClick(currentNode, false);
                else if (currentNode.getData() === endNode)
                    updateRandomVisitedNodes(endNode);
            }, 10)
        }
        else if (remAlgo.includes(currentState.algorithm())) {
            removeAllClasses(1, []);
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
        removeAllClasses(1, []);
        currentState.changeRun();
        setTimeout(() => {
            currentState.changeRun();
            startButtonClick(currentNode, false);
        }, 250)
    }
}

const StartButton = () => {

    return  (
        <Button className = "button" id = "start-button" onClick={() => {
            let currentNode: Node<number> = currentState.graph().nodes().get(currentState.startNode())
            removeAllClasses(1, []);
            if (currentState.run()) startButtonClick(currentNode, true);
            else if (!currentState.run()) {
                currentState.changeRun();
                startButtonClick(currentNode, false)
            }
        }}>
            <StartButtonIcon/>
        </Button>
    )
}


export default StartButton

