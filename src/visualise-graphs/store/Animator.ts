import useFrontendStateManager from "./FrontendStateManager";

export default class Animator {
    static async animatePathNodes (path:any) {
        const store = useFrontendStateManager.getState();
        const internalSet = store.pathNodes;
        for (const node of path) {
            internalSet.add(node);
            useFrontendStateManager.setState({ pathNodes: new Set(internalSet) });
            await new Promise(res => setTimeout(res, 10)); // Delay for smooth animation
        }
        // for the last one.
        useFrontendStateManager.setState({ pathNodes: new Set(internalSet) });
    }
    static async animateVisitedNodes (visited : Set<number>) {
        const store = useFrontendStateManager.getState();
        const internalSet = store.visitedNodes;
        let i = 0;
        for (const node of visited) {
            internalSet.add(node);
            i++;

            // Every 4 nodes, just debounce.
            if (i % 4 === 0) {
                useFrontendStateManager.setState({ visitedNodes: new Set(internalSet) });
                await new Promise(res => setTimeout(res, 2)); // Delay for smooth animation
            }
        }
        // for the last one.
        useFrontendStateManager.setState({ visitedNodes: new Set(internalSet) });

    }
}