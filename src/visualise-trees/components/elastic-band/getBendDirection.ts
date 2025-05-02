import BackendStateManager from "../../api/BackendStateManager";

const getBendDirection = (srcId: string, destId: string): 1 | -1 | 0 => {
    const graph = BackendStateManager.graph;
    const srcHasDest = graph.vertices().get(srcId)?.getAdjVertices().has(destId)
    const destHasSrc = graph.vertices().get(destId)?.getAdjVertices().has(srcId)

    if (srcHasDest && destHasSrc) {
        // Arbitrary tie-breaker to decide curve direction
        return srcId < destId ? 1 : -1;
    }
    return 0; // Not bidirectional, no bend
}
export default getBendDirection;
