import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import {NOTSET, NOTSET_t} from "@graph/ts/Types";
import BackendStateManager from "./BackendStateManager";

export default class Animator {
    static async animatePathNodes(path: number [] | NOTSET_t) {
        const store = useFrontendStateManager.getState();
        const internalSet = store.pathNodes;
        if (path === NOTSET)
            return;

        for (const node of path) {
            internalSet.add(node);
            useFrontendStateManager.setState({pathNodes: new Set(internalSet)});
            await new Promise(res => setTimeout(res, 10)); // Delay for smooth animation
        }
        // for the last one.
        useFrontendStateManager.setState({pathNodes: new Set(internalSet)});
    }

    static async animateVisitedNodes(visited: Map<number, NodeType.START_NODE | NodeType.BOMB_NODE>) {
        const store = useFrontendStateManager.getState();
        const internalSet = store.visitedNodes;
        let i = 0;
        for (const entry of visited) {
            internalSet.set(entry[0], entry[1]);
            i++;

            // Every 4 nodes, just debounce.
            if (i % 4 === 0) {
                useFrontendStateManager.setState({visitedNodes: new Map(internalSet)});
                await new Promise(res => setTimeout(res, 2)); // Delay for smooth animation
            }
        }
        // for the last one.
        useFrontendStateManager.setState({visitedNodes: new Map(internalSet)});
    }

    // return if there is no neighbour
    // return if there is a start node has come
    static async animateRandomWalk(nodeId: number | NOTSET_t): Promise<void> {
        if (useFrontendStateManager.getState().endNodeId === nodeId ||
            BackendStateManager.graph().nodes().get((nodeId as number)).getAdjNodes().length === 1 ||
            !useFrontendStateManager.getState().executingRandomWalk
        ) {
            if (useFrontendStateManager.getState().endNodeId === nodeId) {
                useFrontendStateManager.setState({randomPathId: nodeId});
                useFrontendStateManager.getState().pathNodes.add(nodeId);
            }
            return;
        }
        useFrontendStateManager.setState({randomPathId: nodeId});
        useFrontendStateManager.getState().pathNodes.add(nodeId);
        await new Promise(res => setTimeout(res, 250));
        await this.animateRandomWalk(
            BackendStateManager.graph().nodes().get((nodeId as number)).getRandomNeighbour().getData());
    }
}