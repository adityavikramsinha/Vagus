import {create} from 'zustand'
import {NOTSET, NOTSET_t} from "../visualise-graphs/ts/Types";
import {FileType} from "../components/file/File";
import {HexProps} from "../visualise-graphs/components/hex/Hex";
import {match, P} from "ts-pattern";
import {useProvidedStore, storeApi} from "../providers/StoreProvider";
import {FileStore} from "../providers/FileExplorer";

export enum NodeAction {
    SET = 'set',
    DELETE = 'del'
}

export enum NodeType {
    START_NODE = 'start-node',
    END_NODE = 'end-node',
    WEIGHT_NODE = 'weight-node',
    BOMB_NODE = 'bomb-node',
    WALL_NODE = 'wall-node',
}

interface GraphStoreProps {
    startId: string | NOTSET_t,
    endId: string | NOTSET_t,
    bombNodeId: string| NOTSET_t,
    hexes: HexProps [],
    hexBoardDimensions: { width: number, height: number },
    hexDimensions: { HEX_WIDTH: number, HEX_HEIGHT: number },
    hexBoard: Record<string| NOTSET_t, NodeType | NOTSET_t>,
    block: boolean,
    // visited contains a map of ids, and the node they were visited from, i.e.
    // from where the path will start.
    visitedNodes: Map<string| NOTSET_t, NodeType.START_NODE | NodeType.BOMB_NODE>,
    pathNodes: Set<string| NOTSET_t>,
    randomPathId: string| NOTSET_t,
    executing: boolean,
}

interface GraphStoreActions  {
    changeNode(nodeType: NodeType, actionType: NodeAction, id: string| NOTSET_t): void,
    setHexBoardDimensions: (dimension: { width: number, height: number }) => void,
}

export interface GraphStore extends GraphStoreActions, GraphStoreProps, FileStore {}


export const graphStore =
    create<GraphStore>()((set) => ({
        startId: NOTSET, endId: NOTSET, bombNodeId: NOTSET,
        activeFiles: {
            [FileType.TS]: NOTSET,
            [FileType.IO]: NOTSET,
            [FileType.BAT]: NOTSET,
            [FileType.SYS]: NOTSET,
            [FileType.GUI]: NOTSET,
            [FileType.MD]: NOTSET
        },
        changeActiveFiles: (newActiveFileId, fileType) => set(
            (state) => ({
                activeFiles: {
                    ...state.activeFiles,
                    [fileType]: newActiveFileId
                }
            })
        ),
        hexes: [],
        weightNodes: new Set(),
        changeNode: (nodeType, nodeAction, id) =>
            set((state) => {
                const newHexBoard = {...state.hexBoard};
                return match([nodeType, nodeAction] as const)
                    .with([NodeType.START_NODE, NodeAction.SET], () => {
                        newHexBoard[state.startId] = NOTSET;
                        state.startId = id;
                        newHexBoard[state.startId] = NodeType.START_NODE;
                        return {hexBoard: newHexBoard};
                    })
                    .with([NodeType.END_NODE, NodeAction.SET], () => {
                        newHexBoard[state.endId] = NOTSET;
                        state.endId = id;
                        newHexBoard[state.endId] = NodeType.END_NODE;
                        return {hexBoard: newHexBoard};
                    })
                    .with([NodeType.BOMB_NODE, NodeAction.SET], () => {
                        newHexBoard[state.bombNodeId] = NOTSET;
                        state.bombNodeId = id;
                        newHexBoard[state.bombNodeId] = NodeType.BOMB_NODE;
                        return {hexBoard: newHexBoard};
                    })
                    .with([P.union(NodeType.START_NODE, NodeType.END_NODE, NodeType.BOMB_NODE), NodeAction.SET], () => {
                        newHexBoard[id] = NOTSET;
                        return {hexBoard: newHexBoard};
                    })
                    .with([P.union(NodeType.WALL_NODE, NodeType.WEIGHT_NODE), NodeAction.SET], () => {
                        newHexBoard[id] = nodeType;
                        return {hexBoard: newHexBoard};
                    })
                    .with([P.union(NodeType.WALL_NODE, NodeType.WEIGHT_NODE), NodeAction.DELETE], () => {
                        newHexBoard[id] = NOTSET;
                        return {hexBoard: newHexBoard};
                    })
                    .otherwise(() => ({hexBoard: newHexBoard}));
            }),
        hexBoardDimensions: {width: 0, height: 0},
        setHexBoardDimensions: (newDimensions) => set({hexBoardDimensions: newDimensions}),
        hexDimensions: {HEX_WIDTH: 26, HEX_HEIGHT: 30},
        hexBoard: {
            [NOTSET]: NodeType.START_NODE
        },
        block: false,
        visitedNodes: new Map(),
        pathNodes: new Set(),
        randomPathId: NOTSET,
        executing: false,
    }))


const useGraphStore = <U>(selector: (state: GraphStore) => U): U => useProvidedStore(selector);

useGraphStore.getState = () => storeApi<GraphStore>().getState();
useGraphStore.setState = (partial: GraphStore
                              | Partial<GraphStore>
                              | ((state: GraphStore) => GraphStore | Partial<GraphStore>),
                          replace ?: false
) => storeApi<GraphStore>().setState(partial, replace)

export default useGraphStore;
