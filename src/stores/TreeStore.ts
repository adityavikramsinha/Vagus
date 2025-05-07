import { FileType } from '../components/file/File';
import { NOTSET, NOTSET_t } from '../visualise-graphs/ts/Types';
import { create } from 'zustand';
import { storeApi, useProvidedStore } from '../providers/StoreProvider';
import { FileStore } from '../providers/FileExplorer';
import { BobProps } from '../visualise-trees/components/bob/Bob';
import { match } from 'ts-pattern';

export enum VertexActions {
    DELETE = 'del',
    ADD = 'add',
}

interface TreeStoreProps {
    nodes: Map<string, BobProps>;
    // Contains, src => dest edge along w the cost associated with that edge.
    edgeList: Map<string, Map<string, number>>;
    srcNodeId: string | NOTSET_t;
    startId: string | NOTSET_t;
    endId: string | NOTSET_t;
    block: boolean;
    executing: boolean;
    // id with the order (to identify which is source and which is dest)
    visitedVertices: Set<string>;
    visitedEdges: Map<string, Set<string>>;
}

type UpdateNodesPayload =
    | { type: VertexActions.ADD; bob: BobProps }
    | { type: VertexActions.DELETE; id: string };

interface TreeStoreActions {
    dispatch: (update: UpdateNodesPayload) => void;
}

export interface TreeStore extends TreeStoreProps, TreeStoreActions, FileStore {}

export const treeStore = create<TreeStore>()((set) => ({
    activeFiles: {
        [FileType.TS]: NOTSET,
        [FileType.IO]: NOTSET,
        [FileType.BAT]: NOTSET,
        [FileType.SYS]: NOTSET,
        [FileType.GUI]: NOTSET,
        [FileType.MD]: NOTSET,
    },
    changeActiveFiles: (newActiveFileId, fileType) =>
        set(({ activeFiles }) => ({
            activeFiles: {
                ...activeFiles,
                [fileType]: newActiveFileId,
            },
        })),
    nodes: new Map(),
    edgeList: new Map<string, Map<string, number>>(),
    srcNodeId: NOTSET,
    dispatch: (update: UpdateNodesPayload) =>
        set((state) =>
            match(update)
                .with({ type: VertexActions.ADD }, ({ bob }) => ({
                    nodes: new Map(state.nodes).set(bob.id, bob),
                }))
                .with({ type: VertexActions.DELETE }, ({ id }) => {
                    const updatedNodes = new Map(state.nodes);
                    updatedNodes.delete(id);
                    return {
                        nodes: updatedNodes,
                        ...(state.srcNodeId === id && { srcNodeId: NOTSET }),
                        ...(state.startId === id && { startId: NOTSET }),
                        ...(state.endId === id && { endId: NOTSET }),
                    };
                })
                .exhaustive(),
        ),

    startId: NOTSET,
    endId: NOTSET,
    block: false,
    executing: false,
    visitedVertices: new Set(),
    visitedEdges: new Map(),
}));

const useTreeStore = <U>(selector: (state: TreeStore) => U): U => useProvidedStore(selector);

useTreeStore.getState = () => storeApi<TreeStore>().getState();
useTreeStore.setState = (
    partial:
        | TreeStore
        | Partial<TreeStore>
        | ((state: TreeStore) => TreeStore | Partial<TreeStore>),
    replace?: false,
) => storeApi<TreeStore>().setState(partial, replace);

export default useTreeStore;
