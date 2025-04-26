import {FileType} from "../components/file/File";
import {NOTSET} from "../visualise-graphs/ts/Types";
import {create} from "zustand";
import {storeApi, useProvidedStore} from "../providers/StoreProvider";
import {FileStore} from "../providers/FileExplorer";
import {SpringyNode} from "../visualise-trees/components/Node";

interface TreeStoreProps {
    nodes: SpringyNode []
}

interface TreeStoreActions {
}

export interface TreeStore extends TreeStoreProps, TreeStoreActions, FileStore {
}

export const treeStore =
    create<TreeStore>()((set) => ({
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

        nodes: []
    }))


const useTreeStore = <U>(selector: (state: TreeStore) => U): U => useProvidedStore(selector);

useTreeStore.getState = () => storeApi<TreeStore>().getState();
useTreeStore.setState = (partial: TreeStore
                             | Partial<TreeStore>
                             | ((state: TreeStore) => TreeStore | Partial<TreeStore>),
                         replace ?: false
) => storeApi<TreeStore>().setState(partial, replace)

export default useTreeStore;