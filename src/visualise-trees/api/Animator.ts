import useTreeStore from "../../stores/TreeStore";
import Syncer from "./Syncer";
import Edge from "../../visualise-graphs/ts/Edge";

export default class Animator {
    static async animateVisitedVertices(vertices: Set<string>, edges: Edge[]) {
        const finalVisitedEdges = new Map<string, Set<string>>();
        for (const edge of edges) {
            await Syncer.supervise(async () => {
                const updatedVisitedVertices = new Set(useTreeStore.getState().visitedVertices);
                const updatedVisitedEdges = new Map(useTreeStore.getState().visitedEdges);

                if (!updatedVisitedVertices.has(edge.src))
                    updatedVisitedVertices.add(edge.src);

                if (!updatedVisitedEdges.has(edge.src))
                    updatedVisitedEdges.set(edge.src, new Set());

                if (!finalVisitedEdges.has(edge.src))
                    finalVisitedEdges.set(edge.src, new Set());

                updatedVisitedEdges.get(edge.src)!.add(edge.dest);
                finalVisitedEdges.get(edge.src)!.add(edge.dest);
                updatedVisitedVertices.add(edge.dest);

                useTreeStore.setState({
                    visitedVertices: updatedVisitedVertices,
                    visitedEdges: updatedVisitedEdges
                });

                await new Promise(resolve => setTimeout(resolve, 500));
            });
        }


        await Syncer.supervise(() => {
            useTreeStore.setState({visitedVertices: vertices, visitedEdges: finalVisitedEdges});
        });
    }
}
