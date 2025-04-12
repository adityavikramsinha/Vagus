import { create } from 'zustand'

export type ActiveFileInterface = {
    ts : string,
    io : string,
    bat : string,
    sys : string
}


type FrontendStateManagerProps = {
    startNodeId : number,
    endNodeId : number,
    bombNodeId : number,
    activeFiles : ActiveFileInterface
}

type FrontendStateManagerActions = {
    changeStartNodeId  : (id : number) => void,
    changeEndNodeId  : (id : number) => void,
    changeBombNodeId : (id : number )=> void,
    changeActiveFiles : (activeFiles : ActiveFileInterface)=> void
}


const useFrontendStateManager =
    create<FrontendStateManagerActions & FrontendStateManagerProps>()((set) => ({
        startNodeId : -1, endNodeId : -1, bombNodeId : -1,
        changeStartNodeId : (id) => set({startNodeId : id}),
        changeEndNodeId : (id) => set({endNodeId : id}),
        changeBombNodeId : (id) => set({bombNodeId : id}),
        wallNodeIds : new Set(),
        activeFiles : {ts : null , io : null , bat : null , sys : null},
        changeActiveFiles : (newActiveFiles)=> set({activeFiles : newActiveFiles }),
    }))


export default useFrontendStateManager;