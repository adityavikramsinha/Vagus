import React from "react";

import HexIcon from "@graph/components/hex/HexIcon";
import useGraphStore, {NodeAction, NodeType} from "../../../stores/GraphStore";
import {NOTSET} from "@graph/ts/Types";
import cn from "@graph/css/cn";
import {match} from "ts-pattern";

export type HexProps = {
    x: number;
    y: number;
    id: number;
};

/**
 * Hex component that controls the internal state (local state) and the external state (hex board, start node and end node)
 * of a Node (back end equivalent)
 * @returns JSX.Element which has the rendered Hex along with its id
 */
const Hex: React.FC<HexProps> = ({x, y, id}) => {
    // Checking the node type from hexBoard map
    const nodeType = useGraphStore(state => state.hexBoard[id] || NOTSET);
    const visited = useGraphStore(state => state.visitedNodes.has(id) ? state.visitedNodes.get(id) : NOTSET);
    const pathNode = useGraphStore(state => state.pathNodes.has(id));
    const isRandomAlgorithmSteppingStone = useGraphStore(state => state.randomPathId === id);
    // Whether the hex is start, end, bomb, weight or wall node
    const isStartNode = nodeType === NodeType.START_NODE;
    const isEndNode = nodeType === NodeType.END_NODE;
    const isBombNode = nodeType === NodeType.BOMB_NODE;
    const isWallNode = nodeType === NodeType.WALL_NODE;
    const isWeightNode = nodeType === NodeType.WEIGHT_NODE;

    const activeIOFile = useGraphStore(state => state.activeFiles.io);
    const changeNode = useGraphStore(state => state.changeNode);

    /**
     * Change hex type based on the active IO file.
     */
    const handleHexClick = () => {
        if (visited !== NOTSET || pathNode)
            return;
        if (isStartNode) {
            changeNode(NodeType.START_NODE, NodeAction.SET, NOTSET);
        } else if (isEndNode) {
            changeNode(NodeType.END_NODE, NodeAction.SET, NOTSET);
        } else if (isBombNode) {
            changeNode(NodeType.BOMB_NODE, NodeAction.SET, NOTSET);
        } else if (isWeightNode) {
            changeNode(NodeType.WEIGHT_NODE, NodeAction.DELETE, id);
        } else if (isWallNode) {
            changeNode(NodeType.WALL_NODE, NodeAction.DELETE, id);
        } else match(activeIOFile)
            .with('io-1', () => changeNode(NodeType.START_NODE, NodeAction.SET, id))
            .with('io-2', () => changeNode(NodeType.END_NODE, NodeAction.SET, id))
            .with('io-3', () => changeNode(NodeType.BOMB_NODE, NodeAction.SET, id))
            .with('io-4', () => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
            .with('io-5', () => changeNode(NodeType.WALL_NODE, NodeAction.SET, id));
    };

    // Hex coordinates.
    const styles: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
    };
    return (
        // removed height and width, so might cause issues later.
        <div className={`absolute flex items-center justify-center overflow-hidden`} style={styles}
             onClick={handleHexClick}>
            <HexIcon className={cn(
                "fill-hex-color", {
                    "fill-visited-node-color-1 transition-all duration-[1s] animate-visited-node-without-bomb": (visited === NodeType.START_NODE) && !pathNode,
                    "fill-visited-node-color-11 transition-all duration-[1s] animate-visited-node-with-bomb": (visited === NodeType.BOMB_NODE) && !pathNode,
                    "fill-path-node-color-1 transition-all duration-[750ms] animate-path": pathNode,
                    "fill-wall-node-color": isWallNode,
                    "animate-random-walk": isRandomAlgorithmSteppingStone,
                })}/>
            <div className={cn(
                "absolute z-[1] w-full h-full justify-center items-center", {
                    "start-node": isStartNode,
                    "bomb-node": isBombNode,
                    "end-node": isEndNode,
                    "weight-node": isWeightNode
                })}/>
        </div>
    );
};

export default Hex;
