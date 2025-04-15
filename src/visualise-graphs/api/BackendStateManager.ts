import Graph from "../ts/Graph";


/**
 * This is the global head. The class is tasked and authorised to control
 * the BackendStateManager of all the functions and states present on the
 * Website.
 *
 * @author aditya , <adityavikramsinha19@gmail.com>
 */
class BackendStateManager<T> {

    // Current graph
    private PRES_GRAPH: Graph<T>;

    // Initialising graph.
    private INIT_GRAPH: Graph<T>;

    // holds the global state for css settings.
    private readonly CSSVariables: Map<string, string>;


// all the identifiers ready to be mapped
    private CSSIdentifiers = [
        'solid-red',
        'light-red',
        'blue',
        'green',
        'yellow',
        'file-bg',
        'file-bg-selected',
        'file-border',
        'cmd-bg',
        'cmd-border',
        'project-bg',
        'moz-sb-color',
        'sb-color',
        'sb-color-hover',
        'sb-color-track',
        'file-hover',
        'algo-folder',
        'node-folder',
        'maze-folder',
        'speed-folder',
        'legend-folder',
        'hex-color',
        'hex-color-hover',
        'wall-node-color',
        'path-node-color-1',
        'path-node-color-2',
        'path-node-color-3',
        'path-node-color-4',
        'path-node-color-5',
        'visited-node-color-1',
        'visited-node-color-2',
        'visited-node-color-3',
        'visited-node-color-11',
        'visited-node-color-21',
        'visited-node-color-31'
    ];

// values of all the identifiers
    private CSSValues = [
        'cdd6f4', // --white (mapped to solid-red for lack of a direct match)
        'cdd6f4', // --white (mapped to light-red for lack of a direct match)
        '89b4fa', // --hex-color-hover (mapped to blue as a close visual, could be adjusted)
        '45475a', // --sb-color (mapped to green as a placeholder, adjust as needed)
        'e5c07b', // Remains the same as there's no direct mapping, keep if relevant
        '11111b', // --file-bg
        '11111b', // --file-bg-selected
        '67BBFF', // Remains the same
        '11111b', // --cmd-bg
        '181825', // --cmd-border
        '1e1e2e', // --project-bg
        '313244', // --moz-sb-color
        '45475a', // --sb-color
        '585b70', // --sb-color-hover
        '1e1e2e', // --sb-color-track
        '1e1e2e', // --file-hover
        'D5756C', // Remains the same
        '67BBFF', // Remains the same
        '4CAF50', // Remains the same
        'E5C07B', // Remains the same
        'EF5350', // Remains the same
        '11111b', // --hex-color
        '89b4fa', // --hex-color-hover
        '313244', // --wall-node-color
        'f5c2e7', // --path-node-color-1
        'f2cdcd', // --path-node-color-2
        'f5c2e7', // --path-node-color-3
        'cba6f7', // --path-node-color-4
        'f38ba8', // --path-node-color-5
        '6184c4', // --visited-node-color-1
        '59a8ce', // --visited-node-color-2
        '1e8576', // --visited-node-color-3
        'eba0ac', // --visited-node-color-11
        'f38ba8', // --visited-node-color-21
        'cba6f7'  // --visited-node-color-31
    ];

    /**
     * Constructs a graph will all values set to null.
     * Unless, the start , end and graph values are given.
     *
     * @param _start The start node of the maze
     * @param _end The end node of the maze
     * @param _graph The graph representation of the maze
     */
    constructor(_start: T = null, _end: T = null, _graph: Graph<T> = null) {
        this.INIT_GRAPH = _graph;
        this.PRES_GRAPH = _graph;
        this.CSSVariables = new Map();

        // get the values of the identifiers
        // create a new Map;
        for (let i: number = 0; i < Math.min(this.CSSValues.length, this.CSSIdentifiers.length); i++)
            this.CSSVariables.set(this.CSSIdentifiers[i], this.CSSValues[i]);
    }

    /**
     *
     * @returns the graph representation of the HexBoard state.
     */
    graph(): Graph<T> {
        return this.PRES_GRAPH;
    }

    /**
     *
     * @returns the Initial graph representation of the HexBoard.
     */
    initGraph(): Graph<T> {
        return this.INIT_GRAPH;
    }

    /**
     *
     * @returns the Map of Css variables in the form [identifier : value ]
     */
    cssVariables(): Map<string, string> {
        return this.CSSVariables;
    }


    /**
     * Updates the value of the present graph.
     *
     * @param toThis the state to be updated to
     */
    changeGraph(toThis: Graph<T>): void {
        this.PRES_GRAPH = toThis;
    }

    /**
     * Updates the value of the init graph
     *
     * @param toThis the state to be updated to
     */
    changeInitGraph(toThis: Graph<T>): void {
        this.INIT_GRAPH = toThis;
    }

    /**
     * Changes the value of a CSS Variable identifier.
     * @param property the property of the identifier to be changed
     * @param identifier the name of the identifier
     * @param value the new value of that identifier
     * @returns true if there is a change, else false.
     */
    changeCSSVariable(property: string, identifier: string, value: string): boolean {

        // first check if css supports
        // if it does
        // return change and return true
        // else return false.
        this.CSSVariables.set(identifier.substring(2), value);
        if (!CSS.supports(property, value))
            return false;
        document.documentElement.style.setProperty(identifier, value);
        return true;
    }
}

// declaring the state variable internally so that
// it gets imported into every file using it
let currentState = new BackendStateManager<number>();

// declaring the pres graph
currentState.changeGraph(new Graph<number>((a, b): number => {
    return a === b ? 0 : a < b ? -1 : 1;
}));

// declaring the initial graph
currentState.changeInitGraph(new Graph<number>((a, b): number => {
    return a === b ? 0 : a < b ? -1 : 1;
}));

// in the beginning,both init and pres are the same graphs.
export default currentState;
