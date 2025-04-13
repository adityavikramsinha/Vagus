import React from "react";
import Node from "../../ts/Node";
import currentState from "../../ts/GlobalState";
import {removeAllClasses} from "../../ts/Utility";
import {NOTSET} from "../../ts/Types";
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

