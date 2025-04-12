import {create} from 'zustand'
import {NOTSET_TYPE, NOTSET} from "../ts/Types";
import {FileType} from "../components/file/File";
import {HexProps} from "../components/hex/Hex";
import populateHexBoard from "../components/hex-board/populateHexBoard";
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
    VISITED_NODE = "visited-node",
    PATH_NODE = 'path-node'
}

type StateManagerProps = {
    startNodeId : number | NOTSET_TYPE,
    endNodeId : number | NOTSET_TYPE,
    bombNodeId : number | NOTSET_TYPE,
    activeFiles : Record<FileType, string |NOTSET_TYPE>,
    hexes: HexProps [],
    weightNodes : Set<number |NOTSET_TYPE>,
    wallNodes : Set<number | NOTSET_TYPE>
}

type StateManagerActions = {
    changeActiveFiles : (newActiveFileId : string, fileType : FileType)=> void,
    setHexBoard  :(rows : number, cols : number , HEX_WIDTH : number, HEX_HEIGHT : number) => void,
    changeNode (nodeType : NodeType, actionType: NodeAction , id : number | NOTSET_TYPE) : void,
}


const useStateManager =
    create<StateManagerActions & StateManagerProps>()((set) => ({
        startNodeId : NOTSET, endNodeId : NOTSET, bombNodeId : NOTSET, wallNodeIds : new Set(), wallNodes : new Set(),
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
        setHexBoard :(rows, cols, HEX_WIDTH, HEX_HEIGHT) => set({hexes : populateHexBoard(rows , cols , HEX_WIDTH, HEX_HEIGHT)}),
        weightNodes : new Set(),
        changeNode: (nodeType, nodeAction, id) =>
            set((state) =>
                match([nodeType, nodeAction] as const)
                    .with([NodeType.START_NODE, P._], () => ({startNodeId: id}))
                    .with([NodeType.END_NODE, P._] , () => ({endNodeId : id}))
                    .with([NodeType.BOMB_NODE, P._] , () => ({bombNodeId : id}))
                    .with([NodeType.WEIGHT_NODE, NodeAction.SET], () =>({weightNodes : new Set(state.weightNodes).add(id)}))
                    .with([NodeType.WEIGHT_NODE, NodeAction.DELETE], ()=>{
                        const updatedSet = new Set(state.weightNodes);
                        updatedSet.delete(id);
                        return {weightNodes: updatedSet}
                    })
                    .with([NodeType.WALL_NODE, NodeAction.SET], () =>({wallNodes : new Set(state.wallNodes).add(id)}))
                    .with([NodeType.WALL_NODE, NodeAction.DELETE], () => {
                        const updatedSet = new Set(state.wallNodes);
                        updatedSet.delete(id);
                        return {wallNodes: updatedSet}
                    })
                    .otherwise(()=>({}))
            ),
    }))


export default useStateManager;