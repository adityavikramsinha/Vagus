import {FileType} from "../components/file/File";
import {NOTSET, NOTSET_t} from "../visualise-graphs/ts/Types";
import {create} from "zustand";
import {storeApi, useProvidedStore} from "../providers/StoreProvider";
import {FileStore} from "../providers/FileExplorer";
import {BobProps} from "../visualise-trees/components/bob/Bob";
import Edge from "../visualise-graphs/ts/Edge";


interface TreeStoreProps  {
    nodes :Map<string, BobProps>,
    // Contains, src => dest edge along w the cost associated with that edge.
    edgeList : Map<string, Map<string, number>>,
    srcNodeId : string| NOTSET_t,
}
interface TreeStoreActions  {}
export interface TreeStore extends TreeStoreProps, TreeStoreActions, FileStore {}

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
            ({activeFiles}) => ({
                activeFiles: {
                    ...activeFiles,
                    [fileType]: newActiveFileId
                }
            })
        ),
        nodes : new Map(),
        edgeList : new Map<string, Map<string , number>>(),
        srcNodeId : NOTSET,
    }))


const useTreeStore = <U>(selector: (state: TreeStore) => U): U => useProvidedStore(selector);

useTreeStore.getState = () => storeApi<TreeStore>().getState();
useTreeStore.setState = (partial: TreeStore
                              | Partial<TreeStore>
                              | ((state: TreeStore) => TreeStore | Partial<TreeStore>),
                         replace ?: false
) => storeApi<TreeStore>().setState(partial, replace)

export default useTreeStore;
