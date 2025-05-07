import Graph from '@graph/ts/Graph';

/**
 * This is the global head. The class is tasked and authorised to control
 * the BackendStateManager of all the functions and states present on the
 * Website.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export default class BackendStateManager {
    // Current graph
    private static PRES_GRAPH = new Graph((a, b) => parseInt(a) - parseInt(b));

    // Initialising graph.
    private static INIT_GRAPH = new Graph((a, b) => parseInt(a) - parseInt(b));

    /**
     *
     * @returns the graph representation of the HexBoard state.
     */
    static graph() {
        return this.PRES_GRAPH;
    }

    /**
     *
     * @returns the Initial graph representation of the HexBoard.
     */
    static initGraph() {
        return this.INIT_GRAPH;
    }

    /**
     * Resets the present graph to clean new graph.
     */
    static resetGraph() {
        this.PRES_GRAPH = new Graph((a, b) => parseInt(a) - parseInt(b));
    }

    /**
     * Resets the initial graph to a clean new graph.
     */
    static resetInitialGraph() {
        this.INIT_GRAPH = new Graph((a, b) => parseInt(a) - parseInt(b));
    }
}
