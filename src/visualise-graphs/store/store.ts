import {create} from 'zustand'
import {NOTSET_TYPE, NOTSET} from "../ts/Types";
import {FileType} from "../components/file/File";
import {HexProps} from "../components/hex/Hex";
import populateHexBoard from "../components/hex-board/populateHexBoard";



type FrontendStateManagerProps = {
    startNodeId : number | NOTSET_TYPE,
    endNodeId : number | NOTSET_TYPE,
    bombNodeId : number | NOTSET_TYPE,
    activeFiles : Record<FileType, string |NOTSET_TYPE>,
    hexes: HexProps [],
}

type FrontendStateManagerActions = {
    changeStartNodeId  : (id : number | NOTSET_TYPE) => void,
    changeEndNodeId  : (id : number | NOTSET_TYPE) => void,
    changeBombNodeId : (id : number | NOTSET_TYPE)=> void,
    changeActiveFiles : (newActiveFileId : string, fileType : FileType)=> void,
    isActiveFile : (id : string , fileType : FileType) => boolean,
    setHexBoard  :(rows : number, cols : number , HEX_WIDTH : number, HEX_HEIGHT : number) => void
}


const useFrontendStateManager =
    create<FrontendStateManagerActions & FrontendStateManagerProps>()((set, get) => ({
        startNodeId : NOTSET, endNodeId : NOTSET, bombNodeId : NOTSET,
        changeStartNodeId : (id) => set({startNodeId : id}),
        changeEndNodeId : (id) => set({endNodeId : id}),
        changeBombNodeId : (id) => set({bombNodeId : id}),
        wallNodeIds : new Set(),
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
        isActiveFile : (id , fileType)=> get().activeFiles[fileType]===id,
        hexes : [],
        setHexBoard :(rows, cols, HEX_WIDTH, HEX_HEIGHT) => set({hexes : populateHexBoard(rows , cols , HEX_WIDTH, HEX_HEIGHT)}),
    }))


export default useFrontendStateManager;