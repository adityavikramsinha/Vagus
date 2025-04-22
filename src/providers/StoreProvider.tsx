import React, { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";


// Provides the context for the Store,
// it is <any> since we don't have the exact types for
// the Stores, however a unified interface should be
// build later on that is super-type of individual store types.
export const StoreCtx = createContext<StoreApi<any> | null>(null);
// _store for using store outside hooks.
let _store : StoreApi<any> | null;


type StoreProviderProps<T> = {
    useStore: StoreApi<T>;
    children: React.ReactNode;
};

/**
 * Store Provider that provides a store for all child elements based on the provided context (store)
 * @param useStore the store to use as context
 * @param children
 * @constructor
 */
export const StoreProvider = <T,>({ useStore, children }: StoreProviderProps<T>) => {
    return (
        <StoreCtx.Provider value={useStore}>
            {children}
        </StoreCtx.Provider>
    );
};


/**
 * Hook to use a provided Store.
 * If there is none, this will error out since it is being used outside a context.
 * @param selector to select store slice.
 */
export const useProvidedStore = <T, U>(selector: (state: T) => U): U => {
    const store = useContext(StoreCtx) as StoreApi<T> | null;
    _store = store;
    if (store === null) {
        throw new Error(
            "useProvidedStore must be used within a StoreProvider. Make sure your component is wrapped in a provider."
        );
    }

    return useStore(store, selector);
};

/**
 * Exposes the store API like a vanilla Zustand store, for usage outside of
 * components and .tsx files.
 */
export const storeApi = <T,>() => {

    // This is of StoreApi<any> initially
    // we can do better, since we have to ensure that the
    const store = _store as StoreApi<T>;
    if(store === null) {
        throw new Error (
            "Store Api must be used within a Store Provider.Make sure your component is wrapped in a provider."
        )
    }

    return store ;
}