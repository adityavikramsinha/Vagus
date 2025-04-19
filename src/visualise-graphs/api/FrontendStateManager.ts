import {create} from 'zustand'
import {NOTSET, NOTSET_t} from "@graph/ts/Types";
import {FileType} from "@graph/components/file/File";
import {HexProps} from "@graph/components/hex/Hex";
import {match, P} from "ts-pattern";

export enum NodeAction {
    SET= 'set',
    DELETE ='del'
}

export enum NodeType {
    START_NODE='start-node',
    END_NODE='end-node',
    WEIGHT_NODE ='weight-node',
    BOMB_NODE ='bomb-node',
    WALL_NODE = 'wall-node',
}

type FrontendStateManagerProps = {
    startNodeId : number | NOTSET_t,
    endNodeId : number | NOTSET_t,
    bombNodeId : number | NOTSET_t,
    activeFiles : Record<FileType, string |NOTSET_t>,
    hexes: HexProps [],
    hexBoardDimensions : {width : number, height:number},
    hexDimensions : {HEX_WIDTH : number, HEX_HEIGHT:number},
    hexBoard : Record<number | NOTSET_t, NodeType | NOTSET_t>,
    block : boolean,
    // visited contains a map of ids, and the node they were visited from, i.e.
    // from where the path will start.
    visitedNodes : Map<number | NOTSET_t, NodeType.START_NODE | NodeType.BOMB_NODE>,
    pathNodes : Set<number | NOTSET_t>,
    randomPathId : number | NOTSET_t,
    executing : boolean,
}

type FrontendStateManagerActions = {
    changeActiveFiles : (newActiveFileId : string, fileType : FileType)=> void,
    changeNode (nodeType : NodeType, actionType: NodeAction , id : number | NOTSET_t) : void,
    setHexBoardDimensions : (dimension :{width : number, height:number})=>void,
}


const useFrontendStateManager =
    create<FrontendStateManagerActions & FrontendStateManagerProps>()((set) => ({
        startNodeId : NOTSET, endNodeId : NOTSET, bombNodeId : NOTSET,
        activeFiles: {
            [FileType.TS]: NOTSET,
            [FileType.IO]: NOTSET,
            [FileType.BAT]: NOTSET,
            [FileType.SYS]: NOTSET,
            [FileType.GUI] : NOTSET,
            [FileType.MD] : NOTSET
        },
        changeActiveFiles : (newActiveFileId, fileType)=> set(
            (state)=>({
                activeFiles : {
                    ...state.activeFiles,
                    [fileType] : newActiveFileId
                }
            })
        ),
        hexes : [],
        weightNodes : new Set(),
        changeNode: (nodeType, nodeAction, id) =>
            set((state) => {
                const newHexBoard = { ...state.hexBoard };
                return match([nodeType, nodeAction] as const)
                    .with([NodeType.START_NODE, NodeAction.SET], () => {
                        newHexBoard[state.startNodeId]=NOTSET;
                        state.startNodeId = id;
                        newHexBoard[state.startNodeId] = NodeType.START_NODE;
                        return { hexBoard: newHexBoard };
                    })
                    .with([NodeType.END_NODE, NodeAction.SET], () => {
                        newHexBoard[state.endNodeId] = NOTSET;
                        state.endNodeId = id;
                        newHexBoard[state.endNodeId] = NodeType.END_NODE;
                        return { hexBoard: newHexBoard };
                    })
                    .with([NodeType.BOMB_NODE, NodeAction.SET], () => {
                        newHexBoard[state.bombNodeId] = NOTSET;
                        state.bombNodeId = id;
                        newHexBoard[state.bombNodeId] = NodeType.BOMB_NODE;
                        return { hexBoard: newHexBoard };
                    })
                    .with([P.union(NodeType.START_NODE, NodeType.END_NODE, NodeType.BOMB_NODE), NodeAction.SET], () => {
                        newHexBoard[id] = NOTSET;
                        return { hexBoard: newHexBoard };
                    })
                    .with([P.union(NodeType.WALL_NODE, NodeType.WEIGHT_NODE), NodeAction.SET], () => {
                        newHexBoard[id] = nodeType;
                        return { hexBoard: newHexBoard };
                    })
                    .with([P.union(NodeType.WALL_NODE, NodeType.WEIGHT_NODE), NodeAction.DELETE], () => {
                        newHexBoard[id] = NOTSET;
                        return { hexBoard: newHexBoard };
                    })
                    .otherwise(() => ({ hexBoard: newHexBoard }));
            }),
        hexBoardDimensions : {width :0, height :0},
        setHexBoardDimensions : (newDimensions)=>set({hexBoardDimensions : newDimensions}),
        hexDimensions : {HEX_WIDTH : 26 , HEX_HEIGHT : 30},
        hexBoard: {
            [NOTSET]: NodeType.START_NODE
        },
        block : false,
        visitedNodes : new Map(),
        pathNodes : new Set(),
        randomPathId : NOTSET,
        executing : false,
    }))

export default useFrontendStateManager;