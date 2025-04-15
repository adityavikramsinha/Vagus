import Graph from "@graph/ts/Graph";


/**
 * This is the global head. The class is tasked and authorised to control
 * the BackendStateManager of all the functions and states present on the
 * Website.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export default class BackendStateManager {

    // Current graph
    private static PRES_GRAPH: Graph<number>= new Graph<number>((a,b):number=>{
        return a === b ? 0 : a < b? -1 : 1;
    });

    // Initialising graph.
    private static INIT_GRAPH: Graph<number>= new Graph<number>((a,b)=>{
        return a === b ? 0 : a < b ? -1 : 1;
    });

    /**
     *
     * @returns the graph representation of the HexBoard state.
     */
    static graph(): Graph<number> {
        return this.PRES_GRAPH;
    }

    /**
     *
     * @returns the Initial graph representation of the HexBoard.
     */
    static initGraph(): Graph<number> {
        return this.INIT_GRAPH;
    }
}