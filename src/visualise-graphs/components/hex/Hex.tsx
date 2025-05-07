import React from 'react';

import HexIcon from '@graph/components/hex/HexIcon';
import useGraphStore, { NodeAction, NodeType } from '../../../stores/GraphStore';
import { NOTSET } from '@graph/ts/Types';
import cn from '../../../cn';
import { match } from 'ts-pattern';
import * as NodeIcon from './NodeIcons';

export type HexProps = {
    x: number;
    y: number;
    id: string;
};

/**
 * Change hex type based on the active IO file.
 */
const handleHexClick = (
    visited: typeof NOTSET | NodeType,
    pathNode: boolean,
    isStartNode: boolean,
    isEndNode: boolean,
    isBombNode: boolean,
    isWeightNode: boolean,
    isWallNode: boolean,
    id: string | typeof NOTSET,
) => {
    const activeIOFile = useGraphStore.getState().activeFiles.io;
    const changeNode = useGraphStore.getState().changeNode;
    if (visited !== NOTSET || pathNode) return;
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
    } else
        match(activeIOFile)
            .with('io-1', () => changeNode(NodeType.START_NODE, NodeAction.SET, id))
            .with('io-2', () => changeNode(NodeType.END_NODE, NodeAction.SET, id))
            .with('io-3', () => changeNode(NodeType.BOMB_NODE, NodeAction.SET, id))
            .with('io-4', () => changeNode(NodeType.WEIGHT_NODE, NodeAction.SET, id))
            .with('io-5', () => changeNode(NodeType.WALL_NODE, NodeAction.SET, id));
};

/**
 * Hex component that controls the internal state (local state) and the external state (hex board, start node and end node)
 * of a Node (back end equivalent)
 * @returns JSX.Element which has the rendered Hex along with its id
 */
const Hex: React.FC<HexProps> = ({ x, y, id }) => {
    // Checking the node type from hexBoard map
    const nodeType = useGraphStore((state) => state.hexBoard[id] || NOTSET);
    const visited = useGraphStore((state) =>
        state.visitedNodes.has(id) ? state.visitedNodes.get(id) : NOTSET,
    );
    const pathNode = useGraphStore((state) => state.pathNodes.has(id));
    const isRandomAlgorithmSteppingStone = useGraphStore((state) => state.randomPathId === id);
    // Whether the hex is start, end, bomb, weight or wall node
    const isStartNode = nodeType === NodeType.START_NODE;
    const isEndNode = nodeType === NodeType.END_NODE;
    const isBombNode = nodeType === NodeType.BOMB_NODE;
    const isWallNode = nodeType === NodeType.WALL_NODE;
    const isWeightNode = nodeType === NodeType.WEIGHT_NODE;
    // Hex coordinates.
    const styles: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
    };
    return (
        <div
            onClick={() =>
                handleHexClick(
                    visited,
                    pathNode,
                    isStartNode,
                    isEndNode,
                    isBombNode,
                    isWeightNode,
                    isWallNode,
                    id,
                )
            }
            className={`absolute flex items-center h-[34px] w-[34px] justify-center overflow-hidden group`}
            style={styles}
        >
            <HexIcon
                className={cn('fill-hex-color', {
                    'fill-visited-node-color-1 transition-all duration-[1s] animate-visited-node-without-bomb':
                        visited === NodeType.START_NODE && !pathNode,
                    'fill-visited-node-color-11 transition-all duration-[1s] animate-visited-node-with-bomb':
                        visited === NodeType.BOMB_NODE && !pathNode,
                    'fill-path-node-color-1 transition-all duration-[750ms] animate-path': pathNode,
                    'fill-wall-node-color': isWallNode,
                    'animate-random-walk': isRandomAlgorithmSteppingStone,
                    'group-hover:fill-hex-color-hover transition-colors duration-[750ms] ease-out':
                        !isWallNode &&
                        !pathNode &&
                        !isRandomAlgorithmSteppingStone &&
                        !(visited === NodeType.START_NODE || visited === NodeType.BOMB_NODE),
                })}
            />
            <div
                className={cn(
                    'absolute z-[1] w-full h-full justify-center items-center pointer-events-none',
                )}
            >
                {isStartNode && (
                    <NodeIcon.StartNodeIcon className="group-hover:animate-hex-hover origin-center" />
                )}
                {isBombNode && (
                    <NodeIcon.BombNodeIcon className="group-hover:animate-hex-hover origin-center" />
                )}
                {isEndNode && (
                    <NodeIcon.EndNodeIcon className="group-hover:animate-hex-hover origin-center" />
                )}
                {isWeightNode && <NodeIcon.WeightNodeIcon />}
            </div>
        </div>
    );
};

export default React.memo(Hex);
