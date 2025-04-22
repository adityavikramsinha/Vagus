import {useContext } from "react";
import {StoreCtx} from "./StoreProvider";
import {StoreApi, useStore} from "zustand";

const useFileExplorer =<T, U>(selector  : (state : T)=>U):U=>{
    const store = useContext(StoreCtx) as StoreApi<T> | null ;
    if(store === null)
        throw new Error("cannot useFileExplorer, outside context since it has no data of the files present. Please see that there is a provided context.");

    return useStore(store , selector);
}


export default useFileExplorer ;