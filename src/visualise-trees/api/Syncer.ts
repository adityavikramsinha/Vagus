import useTreeStore from '../../stores/TreeStore';

export default class Syncer {
    static async supervise(fn: () => Promise<void> | void) {
        if (!useTreeStore.getState().executing) return;
        await fn();
    }
}
