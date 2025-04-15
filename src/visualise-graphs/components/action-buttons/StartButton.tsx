import React from "react";
import BackendStateManager from "@graph/api/BackendStateManager";
import {AlgoType, NOTSET, NOTSET_t} from "@graph/ts/Types";
import Button from "@graph/components/action-buttons/Button";
import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import Syncer from "@graph/api/Syncer";
import {match, P} from "ts-pattern";
import Algorithms from "@graph/ts/Algorithms";
import Animator from "@graph/api/Animator";
import Pipe from "@graph/api/Pipe";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@graph/components/DialogBox";


const StartButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <g clipPath="url(#clip0_80_24)">
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

export enum Exception {
    START_NODE_NOTSET,
    END_NODE_NOTSET,
    ALGORITHM_NOTSET,
    BI_DIRECTIONAL_EXTRA_ARGS
}

const startButtonClick = (
    algoFile: string | NOTSET_t
): Exception | true => {
    let biDirectionalException = false;
    const startNodeId = useFrontendStateManager.getState().startNodeId;
    const endNodeId = useFrontendStateManager.getState().endNodeId;
    const bombNodeId = useFrontendStateManager.getState().bombNodeId;
    if (!useFrontendStateManager.getState().block) {
        if (algoFile === NOTSET) return Exception.ALGORITHM_NOTSET;
        else if (startNodeId === NOTSET) return Exception.START_NODE_NOTSET;
        else if (endNodeId === NOTSET) return Exception.END_NODE_NOTSET;

        Syncer.syncInitialGraph();
        // I guess we have to now update the graph.
        for (const [nodeKey, nodeType] of Object.entries(useFrontendStateManager.getState().hexBoard)) {
            const id = Number(nodeKey);
            if (nodeType === NodeType.WALL_NODE)
                Syncer.removeNode(id);
            else if (nodeType === NodeType.WEIGHT_NODE) {
                const srcNode = BackendStateManager.graph().nodes().get(id);
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
                    await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.A_STAR_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                }
            })
            .with(P.union('ts-2', 'ts-6'), async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.BEST_FIRST_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.BEST_FIRST_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                }
            })
            .with('ts-3', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.BREADTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.BREADTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                }
            })
            .with('ts-4', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.DEPTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.DEPTH_FIRST_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                }
            })
            .with('ts-5', async () =>{
                useFrontendStateManager.setState({executingRandomWalk : true});
                await Animator.animateRandomWalk(useFrontendStateManager.getState().startNodeId);
                useFrontendStateManager.setState({executingRandomWalk : false});
                useFrontendStateManager.setState({block : false});
                useFrontendStateManager.setState({randomPathId : NOTSET});
            })
            .with('ts-8', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.DIJKSTRAS_SEARCH,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.DIJKSTRAS_SEARCH,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                }
            })
            .with('ts-10', async () => {
                if (bombNodeId === NOTSET) {
                    const [path, visitedStart, visitedEnd] = Algorithms.biDirectional(
                        startNodeId,
                        endNodeId
                    )
                    await Animator.animateVisitedNodes(
                        Pipe.andInterleaveSetsToMap(visitedStart, visitedEnd, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    useFrontendStateManager.getState().setBlock(false);
                    biDirectionalException = true
                }
                ;
            })
            .with('ts-9', async () => {
                if (bombNodeId === NOTSET) {
                    const {path, visited} = Algorithms.runWithoutBombNode(
                        AlgoType.BELLMAN_FORD,
                        startNodeId,
                        endNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visited, NodeType.START_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                } else {
                    const {path, visitedP1, visitedP2} = Algorithms.runWithBombNode(
                        AlgoType.BELLMAN_FORD,
                        startNodeId,
                        endNodeId,
                        bombNodeId
                    );
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP1, NodeType.START_NODE));
                    await Animator.animateVisitedNodes(Pipe.setToMap(visitedP2, NodeType.BOMB_NODE));
                    await Animator.animatePathNodes(path);
                    useFrontendStateManager.getState().setBlock(false);
                }
            });
        return biDirectionalException ? Exception.BI_DIRECTIONAL_EXTRA_ARGS : true;
    }
}

const StartButton = () => {
    const [error, setError] = React.useState<{
        encountered: boolean,
        message?: string,
        header?: string
    }>({encountered: false})
    return (
        <Dialog open={error.encountered} onOpenChange={(open) => !open && setError({encountered: false})}>
            <DialogTrigger asChild>
                <Button disabled={useFrontendStateManager(state => state.block)} className="button" id="start-button"
                        onClick={() => {
                            const algoFile = useFrontendStateManager.getState().activeFiles.ts;
                            const err = startButtonClick(algoFile)
                            match(err)
                                .with(Exception.START_NODE_NOTSET, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        Start Node is of type NOTSET.
        This exception is thrown by the Runtime Environment because no Start Node has been selected.`,
                                    header: "RTE 0x01"
                                }))
                                .with(Exception.END_NODE_NOTSET, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        End Node is NOTSET.
        This exception is thrown by the Runtime Environment because no End Node has been selected.`,
                                    header: "RTE 0x02"
                                }))
                                .with(Exception.ALGORITHM_NOTSET, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        No Algorithm has been selected.
        Please select an algorithm before attempting to run the visualization.`,
                                    header: "RTE 0x03"
                                }))
                                .with(Exception.BI_DIRECTIONAL_EXTRA_ARGS, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        Argument mismatch occurred.
        A Bi Directional Search cannot be started with a Bomb Node, Start Node & End Node.
        You must have only 2 Nodes, (Start Node & End Node).
                                    `,
                                    header: "CTE 0x01"
                                }))
                        }}>
                    <StartButtonIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="stop-dialog-content">
                <DialogHeader className="stop-dialog-header">
                    <DialogTitle className="stop-dialog-title">{error.header}</DialogTitle>
                    <DialogDescription className="stop-dialog-description">
                        {error.message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="stop-dialog-footer">
                    <DialogClose asChild>
                        <Button className="stop-dialog-cancel-button">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default StartButton

