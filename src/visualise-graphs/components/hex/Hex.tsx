import React from "react";

import HexIcon from "./HexIcon";
import useFrontendStateManager, {NodeAction, NodeType} from "../../store/store";
import {NOTSET} from "../../ts/Types";
import cn from "../../css/cn";
import {match} from "ts-pattern";

export type HexProps = {
    x: number,
    y: number,
    id: number
}
/**
 * @returns JSX.Element which has the rendered Hex along with its id
 */
const Hex: React.FC<HexProps> = ({x, y, id}) => {
    const isStartNode = useFrontendStateManager(state => state.startNodeId === id);
    const isEndNode = useFrontendStateManager(state => state.endNodeId === id);
    const isBombNode = useFrontendStateManager(state => state.bombNodeId === id);
    const isWallNode = useFrontendStateManager(state => state.wallNodes.has(id));
    const isWeightNode = useFrontendStateManager(s => s.weightNodes.has(id));
    const activeFilesIo = useFrontendStateManager(state => state.activeFiles).io;
    const changeNode = useFrontendStateManager(state => state.changeNode);
    const handleHexClick = () => {
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
            .with('io-2', () => changeNode(NodeType.START_NODE, NodeAction.SET, id))
            .with('io-3', () => changeNode(NodeType.END_NODE, NodeAction.SET, id))
            .with('io-4', () => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
            .with('io-5', () => changeNode(NodeType.WALL_NODE, NodeAction.SET, id))

    }
    const styles: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
    }
    let classes = cn({
        "prop-holder": true,
        "start-node": isStartNode,
        "bomb-node": isBombNode,
        "end-node": isEndNode,
        "weight-node": isWeightNode
    });

    return (
        <div className="hexagon" style={styles} onClick={handleHexClick}>
            {/*FIXME there is a # here, it needs to be moved global*/}
            <HexIcon style={{fill: isWallNode ? "#313244" : ""}}/>
            <div className={classes}/>
        </div>
    );
}

export default Hex;
