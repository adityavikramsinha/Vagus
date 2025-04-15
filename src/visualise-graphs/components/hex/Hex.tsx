import React from "react";

import HexIcon from "./HexIcon";
import useFrontendStateManager, {NodeAction, NodeType} from "../../api/FrontendStateManager";
import {NOTSET} from "../../ts/Types";
import cn from "../../css/cn";
import {match} from "ts-pattern";

export type HexProps = {
    x: number;
    y: number;
    id: number;
};

/**
 * @returns JSX.Element which has the rendered Hex along with its id
 */
const Hex: React.FC<HexProps> = ({x, y, id}) => {
    // Checking the node type from hexBoard map
    const nodeType = useFrontendStateManager(state => state.hexBoard[id] || NOTSET);
    const visited = useFrontendStateManager(state => state.visitedNodes.has(id) ? state.visitedNodes.get(id) : NOTSET);
    const pathNode = useFrontendStateManager(state => state.pathNodes.has(id));
    // Whether the hex is start, end, bomb, weight or wall node
    const isStartNode = nodeType === NodeType.START_NODE;
    const isEndNode = nodeType === NodeType.END_NODE;
    const isBombNode = nodeType === NodeType.BOMB_NODE;
    const isWallNode = nodeType === NodeType.WALL_NODE;
    const isWeightNode = nodeType === NodeType.WEIGHT_NODE;

    const activeFilesIo = useFrontendStateManager(state => state.activeFiles).io;
    const changeNode = useFrontendStateManager(state => state.changeNode);
    const handleHexClick = () => {
        if (visited !== NOTSET || pathNode)
            return;
        if (isStartNode) {
            if (activeFilesIo !== 'io-1') changeNode(NodeType.START_NODE, NodeAction.SET, NOTSET);
        } else if (isEndNode) {
            if (activeFilesIo !== 'io-2') changeNode(NodeType.END_NODE, NodeAction.SET, NOTSET);
        } else if (isBombNode) {
            if (activeFilesIo !== 'io-3') changeNode(NodeType.BOMB_NODE, NodeAction.SET, NOTSET);
        } else if (isWeightNode) {
            if (activeFilesIo !== 'io-4') changeNode(NodeType.WEIGHT_NODE, NodeAction.DELETE, id);
        } else if (isWallNode) {
            if (activeFilesIo !== 'io-5') changeNode(NodeType.WALL_NODE, NodeAction.DELETE, id);
        } else match(activeFilesIo)
            .with('io-1', () => changeNode(NodeType.START_NODE, NodeAction.SET, id))
            .with('io-2', () => changeNode(NodeType.END_NODE, NodeAction.SET, id))
            .with('io-3', () => changeNode(NodeType.BOMB_NODE, NodeAction.SET, id))
            .with('io-4', () => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
            .with('io-5', () => changeNode(NodeType.WALL_NODE, NodeAction.SET, id));
    };

    const styles: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
    };

    let hexIconClasses = cn({
        "visited-node": (visited === NodeType.START_NODE) && !pathNode,
        "icon": true,
        "visited-node-bomb": (visited === NodeType.BOMB_NODE) && !pathNode,
        "path-node": pathNode,
        "wall-node": isWallNode
    });
    const stringer = "hi"
    // Apply classes based on node type
    let classes = cn({
        "prop-holder": true,
        "start-node": isStartNode,
        "bomb-node": isBombNode,
        "end-node": isEndNode,
        "weight-node": isWeightNode,
    });

    return (
        <div className="hexagon" style={styles} onClick={handleHexClick}>
            {/*FIXME there is a # here, it needs to be moved global*/}
            <HexIcon className={hexIconClasses}/>
            <div className={classes}/>
        </div>
    );
};

export default Hex;
