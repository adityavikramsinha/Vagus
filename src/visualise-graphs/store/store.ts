import {create} from 'zustand'
import {NOTSET_TYPE, NOTSET} from "../ts/Types";

export type ActiveFileInterface = {
    ts : string,
    io : string,
    bat : string,
    sys : string
}


type FrontendStateManagerProps = {
    startNodeId : number | NOTSET_TYPE,
    endNodeId : number | NOTSET_TYPE,
    bombNodeId : number | NOTSET_TYPE,
    activeFiles : ActiveFileInterface
}

type FrontendStateManagerActions = {
    changeStartNodeId  : (id : number | NOTSET_TYPE) => void,
    changeEndNodeId  : (id : number | NOTSET_TYPE) => void,
    changeBombNodeId : (id : number | NOTSET_TYPE)=> void,
    changeActiveFiles : (activeFiles : ActiveFileInterface)=> void
}


const useFrontendStateManager =
    create<FrontendStateManagerActions & FrontendStateManagerProps>()((set) => ({
        startNodeId : NOTSET, endNodeId : NOTSET, bombNodeId : NOTSET,
        changeStartNodeId : (id) => set({startNodeId : id}),
        changeEndNodeId : (id) => set({endNodeId : id}),
        changeBombNodeId : (id) => set({bombNodeId : id}),
        wallNodeIds : new Set(),
        activeFiles : {ts : null , io : null , bat : null , sys : null},
        changeActiveFiles : (newActiveFiles)=> set({activeFiles : newActiveFiles }),
    }))


export default useFrontendStateManager;