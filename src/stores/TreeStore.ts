import {FileType} from "../components/file/File";
import {NOTSET, NOTSET_t} from "../visualise-graphs/ts/Types";
import {create} from "zustand";
import {storeApi, useProvidedStore} from "../providers/StoreProvider";

type TreeStoreProps = {
    activeFiles: Record<FileType, string | NOTSET_t>,
}

type TreeStoreActions = {
    changeActiveFiles: (newActiveFileId: string, fileType: FileType) => void
}


type TreeStore = TreeStoreProps & TreeStoreActions;

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
    }))


const useTreeStore = <U>(selector: (state: TreeStore) => U): U => useProvidedStore(selector);

useTreeStore.getState = () => storeApi<TreeStore>().getState();
useTreeStore.setState = (partial: TreeStore
                              | Partial<TreeStore>
                              | ((state: TreeStore) => TreeStore | Partial<TreeStore>),
                         replace ?: false
) => storeApi<TreeStore>().setState(partial, replace)

export default useTreeStore;