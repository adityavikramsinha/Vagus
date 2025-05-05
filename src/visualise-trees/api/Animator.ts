import useTreeStore from "../../stores/TreeStore";
import Syncer from "./Syncer";

export default class Animator {
    static async animateVisitedVertices() {
        const nodes = useTreeStore.getState().nodes;
        let visitedVertices = useTreeStore.getState().visitedVertices;

        let i = 0 ;
        for (const [nodeId, _] of nodes) {
            await Syncer.supervise(async () => {
                const updated = new Map(visitedVertices);
                updated.set(nodeId, i++);
                visitedVertices = updated; // update local reference
                useTreeStore.setState({ visitedVertices: updated });

                await new Promise(resolve => setTimeout(resolve, 1200));
            });
        }

        await Syncer.supervise(() => {
            useTreeStore.setState({ visitedVertices });
        });
    }
}
