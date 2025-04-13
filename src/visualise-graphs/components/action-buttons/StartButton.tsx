import React from "react";
import Node from "../../ts/Node";
import currentState from "../../ts/GlobalState";
import {removeAllClasses} from "../../ts/Utility";
import {AlgoType, NOTSET} from "../../ts/Types";
import Button from "./Button";
import useStateManager, {NodeType} from "../../store/FrontendStateManager";
import Syncer from "../../store/Syncer";


const StartButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <g clip-path="url(#clip0_80_24)">
                <path d="M14.5 7.63398C15.1667 8.01888 15.1667 8.98112 14.5 9.36602L6.25 14.1292C5.58333 14.5141 4.75 14.0329 4.75 13.2631L4.75 3.73686C4.75 2.96706 5.58333 2.48593 6.25 2.87083L14.5 7.63398Z" stroke="#00FF2F" fill="#00FF2F" fillOpacity="0.1"/>
            </g>
            <defs>
                <clipPath id="clip0_80_24">
                    <rect width="17" height="17" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    )
}


const startButtonClick = (
    currentNode: Node<number>,
): void => {
    if (!useStateManager.getState().block) {
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
        console.log(useStateManager.getState().activeFiles.ts, AlgoType);
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

