import useGraphStore, {NodeType} from "@graph/api/FrontendStateManager";
import {NOTSET, NOTSET_t} from "@graph/ts/Types";
import BackendStateManager from "./BackendStateManager";
import Syncer from "./Syncer";

export default class Animator {
    static async animatePathNodes(path: number [] | NOTSET_t) {
        if (path === NOTSET) return;
        const store = useGraphStore.getState();
        const internalSet = store.pathNodes;

        for (const node of path) {
            await Syncer.supervise(async () => {
                internalSet.add(node);
                useGraphStore.setState({pathNodes: new Set(internalSet)});
                await new Promise(res => setTimeout(res, 10)); // Delay for smooth animation
            })
        }
        // for the last one.
        await Syncer.supervise(() => useGraphStore.setState({pathNodes: new Set(internalSet)}));
    }

    static async animateVisitedNodes(visited: Map<number, NodeType.START_NODE | NodeType.BOMB_NODE>) {
        const store = useGraphStore.getState();
        const internalSet = store.visitedNodes;
        let i = 0;
        for (const entry of visited) {
            await Syncer.supervise(async () => {
                internalSet.set(entry[0], entry[1]);
                i++;
                // Every 4 nodes, just debounce.
                if (i % 4 === 0) {
                    useGraphStore.setState({visitedNodes: new Map(internalSet)});
                    await new Promise(res => setTimeout(res, 2)); // Delay for smooth animation
                }
            })

        }
        // for the last one.
        await Syncer.supervise(() => {
            useGraphStore.setState({visitedNodes: new Map(internalSet)})
        });
    }

    // return if there is no neighbour
    // return if there is a start node has come
    static async animateRandomWalk(nodeId: number | NOTSET_t): Promise<void> {
        if (useGraphStore.getState().endNodeId === nodeId ||
            BackendStateManager.graph().nodes().get((nodeId as number)).getAdjNodes().length === 1) {
            if (useGraphStore.getState().endNodeId === nodeId) {
                useGraphStore.setState({randomPathId: nodeId});
                useGraphStore.getState().pathNodes.add(nodeId);
            }
            return;
        }
        await Syncer.supervise( async () => {
            useGraphStore.setState({randomPathId: nodeId});
            useGraphStore.getState().pathNodes.add(nodeId);
            await new Promise(res => setTimeout(res, 250));
            await this.animateRandomWalk(
                BackendStateManager.graph().nodes().get((nodeId as number)).getRandomNeighbour().getData());
        })
    }
}