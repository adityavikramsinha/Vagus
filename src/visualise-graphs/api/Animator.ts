import useFrontendStateManager, {NodeAction, NodeType} from "./FrontendStateManager";
import {NOTSET, NOTSET_t} from "../ts/Types";

export default class Animator {
    static async animatePathNodes (path:number [] | NOTSET_t) {
        const store = useFrontendStateManager.getState();
        const internalSet = store.pathNodes;
        const prevBombNode = store.bombNodeId;
        if(path === NOTSET)
            return;

        for (const node of path) {
            internalSet.add(node);
            useFrontendStateManager.setState({ pathNodes: new Set(internalSet) });
            store.changeNode(NodeType.START_NODE, NodeAction.SET, node);
            await new Promise(res => setTimeout(res, 10)); // Delay for smooth animation
        }
        // for the last one.
        useFrontendStateManager.setState({ pathNodes: new Set(internalSet) });
        for (const node of path.reverse()) {
            store.changeNode(NodeType.START_NODE, NodeAction.SET, node);
        }
        if(prevBombNode !== NOTSET)
            store.changeNode(NodeType.BOMB_NODE, NodeAction.SET, prevBombNode);
        store.changeNode(NodeType.END_NODE, NodeAction.SET, path[0]);
    }

    static async animateVisitedNodes (visited : Map<number, NodeType.START_NODE | NodeType.BOMB_NODE>) {
        const store = useFrontendStateManager.getState();
        const internalSet = store.visitedNodes;
        let i = 0;
        for (const entry of visited) {
            internalSet.set(entry[0], entry[1]);
            i++;

            // Every 4 nodes, just debounce.
            if (i % 4 === 0) {
                useFrontendStateManager.setState({ visitedNodes: new Map(internalSet) });
                await new Promise(res => setTimeout(res, 2)); // Delay for smooth animation
            }
        }
        // for the last one.
        useFrontendStateManager.setState({ visitedNodes: new Map(internalSet) });

    }
}