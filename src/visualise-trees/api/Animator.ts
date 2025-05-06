import useTreeStore from "../../stores/TreeStore";
import Syncer from "./Syncer";

export default class Animator {
    static async animateVisitedVertices(vertices: Set<string>, edges: Map<string, Set<string>>) {

        for (const [nodeId, edgesVisited] of edges) {
            for (const dest of edgesVisited) {
                await Syncer.supervise(async () => {
                    const updatedVisitedVertices = new Set(useTreeStore.getState().visitedVertices);
                    const updatedVisitedEdges = new Map(useTreeStore.getState().visitedEdges);

                    if (!updatedVisitedVertices.has(nodeId))
                        updatedVisitedVertices.add(nodeId);

                    if (!updatedVisitedEdges.has(nodeId))
                        updatedVisitedEdges.set(nodeId, new Set());

                    updatedVisitedEdges.get(nodeId)!.add(dest);
                    updatedVisitedVertices.add(dest);

                    useTreeStore.setState({
                        visitedVertices: updatedVisitedVertices,
                        visitedEdges: updatedVisitedEdges
                    });

                    await new Promise(resolve => setTimeout(resolve, 500));
                });
            }
        }


        await Syncer.supervise(() => {
            useTreeStore.setState({visitedVertices: vertices, visitedEdges: edges});
        });
    }
}
