import React, { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';
import { FileStore } from './FileExplorer';
import { ActionStore } from './ActionStore';

export interface BaseStore extends FileStore, ActionStore {}

// Provides the context for the Store for a Store that MUST extend BaseStore.
export const StoreCtx = createContext<StoreApi<BaseStore> | null>(null);
// _store for using store outside hooks.
let _store: StoreApi<BaseStore> | null;

type StoreProviderProps<T extends BaseStore> = {
    useStore: StoreApi<T>;
    children: React.ReactNode;
};

/**
 * Store Provider that provides a store for all child elements based on the provided context (store)
 * @param useStore the store to use as context
 * @param children
 * @constructor
 */
export const StoreProvider = <T extends BaseStore>({
    useStore,
    children,
}: StoreProviderProps<T>) => {
    return <StoreCtx.Provider value={useStore}>{children}</StoreCtx.Provider>;
};

/**
 * Hook to use a provided Store.
 * If there is none, this will error out since it is being used outside a context.
 * @param selector to select store slice.
 */
export const useProvidedStore = <T extends BaseStore, U>(selector: (state: T) => U): U => {
    const store = useContext(StoreCtx) as StoreApi<T> | null;
    _store = store;
    if (store === null) {
        throw new Error(
            'useProvidedStore must be used within a StoreProvider. Make sure your component is wrapped in a provider.',
        );
    }

    return useStore(store, selector);
};

/**
 * Exposes the store API like a vanilla Zustand store, for usage outside of
 * components and .tsx files.
 */
export const storeApi = <T extends BaseStore>() => {
    // This is of StoreApi<any> initially
    // we can do better, since we have to ensure that the
    const store = _store as StoreApi<T>;
    if (store === null) {
        throw new Error(
            `Store Api(of type extending BaseStore) must be used within a Store Provider.Make sure your component is wrapped in a provider.`,
        );
    }

    return store;
};
