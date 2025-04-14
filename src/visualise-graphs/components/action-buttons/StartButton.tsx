import React from "react";
import currentState from "../../ts/GlobalState";
import {AlgoType, NOTSET, NOTSET_t} from "../../ts/Types";
import Button from "./Button";
import useFrontendStateManager, {NodeType} from "../../store/FrontendStateManager";
import Syncer from "../../store/Syncer";
import {match, P} from "ts-pattern";
import Algorithms from "../../ts/Algorithms";
import Animator from "../../store/Animator";


const StartButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <g clip-path="url(#clip0_80_24)">
                <path
                    d="M14.5 7.63398C15.1667 8.01888 15.1667 8.98112 14.5 9.36602L6.25 14.1292C5.58333 14.5141 4.75 14.0329 4.75 13.2631L4.75 3.73686C4.75 2.96706 5.58333 2.48593 6.25 2.87083L14.5 7.63398Z"
                    stroke="#00FF2F" fill="#00FF2F" fillOpacity="0.1"/>
            </g>
            <defs>
                <clipPath id="clip0_80_24">
                    <rect width="17" height="17" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    )
}


const startButtonClick =  (
    algoFile: string | NOTSET_t
): void => {
    const startNodeId = useFrontendStateManager.getState().startNodeId;
    const endNodeId = useFrontendStateManager.getState().endNodeId;
    const bombNodeId = useFrontendStateManager.getState().bombNodeId;
    if (!useFrontendStateManager.getState().block) {
        if (algoFile === NOTSET) {
            alert('Please select an algorithm before continuing!');
            return;
        } else if (startNodeId === NOTSET) {
            alert('Please select a starting node');
            return;
        } else if (endNodeId === NOTSET) {
            alert('Please select a ending node');
            return;
        }
        // I guess we have to now update the graph.
        for (const [nodeKey, nodeType] of Object.entries(useFrontendStateManager.getState().hexBoard)) {
            const id = Number(nodeKey);
            if (nodeType === NodeType.WALL_NODE)
                Syncer.removeNode(id);
            else if (nodeType === NodeType.WEIGHT_NODE) {
                const srcNode = currentState.graph().nodes().get(id);
                srcNode.getAdjNodes().forEach(edge => Syncer.updateEdge(edge.dest.getData(), id));
            }
        }
        Syncer.cleanHexBoard();
        useFrontendStateManager.getState().setBlock(true);
        match(algoFile)
            .with(P.union('ts-1', 'ts-7'), async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.A_STAR_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(visited);
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.A_STAR_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                }
            })
            .with(P.union('ts-2', 'ts-6'), async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.BEST_FIRST_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(visited);
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.BEST_FIRST_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                }
            })
            .with('ts-3', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.BREADTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(visited);
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.BREADTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                }
            })
            .with('ts-4', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.DEPTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(visited);
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.DEPTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                }
            })
            .with('ts-8', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.DIJKSTRAS_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(visited);
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.DIJKSTRAS_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                }
            })
            .with('ts-10', ()=>{
                if (bombNodeId === NOTSET) {
                    const [path, visitedStart, visitedEnd] = Algorithms.biDirectional(
                        startNodeId,
                        endNodeId
                    )
                }
                else {
                    alert("You cannot run Bi Directional Algorithm with Bomb Node");
                    return;
                }
            })
            .with('ts-9', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.BELLMAN_FORD,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(visited);
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.BELLMAN_FORD,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                }
            });
    }
}

const StartButton = () => {

    return (
        <Button disabled={useFrontendStateManager(state =>state.block)} className="button" id="start-button" onClick={() => {
            const algoFile = useFrontendStateManager.getState().activeFiles.ts;
            startButtonClick(algoFile)
        }}>
            <StartButtonIcon/>
        </Button>
    )
}


export default StartButton

