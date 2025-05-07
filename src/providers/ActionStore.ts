import { useContext } from 'react';
import { StoreCtx } from './StoreProvider';
import { StoreApi, useStore } from 'zustand';
import { NOTSET_t } from '../visualise-graphs/ts/Types';

export interface ActionStore {
    startId: string | NOTSET_t;
    endId: string | NOTSET_t;
    executing: boolean;
    block: boolean;
}

const useActionStore = <T extends ActionStore, U>(selector: (state: T) => U): U => {
    const store = useContext(StoreCtx) as StoreApi<ActionStore> | null;
    if (store === null)
        throw new Error(
            'cannot useActionStore, outside context since it has no data of the files' +
                ' present.Please see that there is a provided context.',
        );

    return useStore(store, selector);
};

export default useActionStore;
