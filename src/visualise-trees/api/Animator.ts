import useTreeStore from "../../stores/TreeStore";
import Syncer from "./Syncer";

export default class Animator {
    static async animateVisitedVertices(vertices: Set<string>, edges: Map<string, Set<string>>) {

        for (const [nodeId, edgesVisited] of edges) {
            await Syncer.supervise(async () => {
                const updatedVisitedVertices = new Set(useTreeStore.getState().visitedVertices);
                const updatedVisitedEdges = new Map(useTreeStore.getState().visitedEdges)
                if (!updatedVisitedVertices.has(nodeId))
                    updatedVisitedVertices.add(nodeId);

                if (!updatedVisitedEdges.has(nodeId))
                    updatedVisitedEdges.set(nodeId, edgesVisited)

                useTreeStore.setState({
                    visitedVertices: updatedVisitedVertices,
                    visitedEdges: updatedVisitedEdges
                });

                await new Promise(resolve => setTimeout(resolve, 500));
                for (const dest of edgesVisited)
                    updatedVisitedVertices.add(dest)
                useTreeStore.setState({
                    visitedEdges : updatedVisitedEdges
                })

                await new Promise(resolve => setTimeout(resolve, 1000));
            });
        }


        await Syncer.supervise(() => {
            useTreeStore.setState({visitedVertices: vertices, visitedEdges: edges});
        });
    }
}
