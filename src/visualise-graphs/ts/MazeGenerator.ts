import useFrontendStateManager from "../store/FrontendStateManager";

/**
 * The basic maze generator class which builds the Sets required for
 * drawing the maze on the website.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
class MazeGenerator {

    /**
     * Generates a maze that blocks the least cost path in the grid
     *
     * @returns a Path which highlights the nodes to be blocked because they are part of the least cost path.
     */
    // TODO: Not implemented yet.
    static genLeastCostPathBlocker(): Set<number> {
        return new Set();
    }

    /**
     * Generates a random maze.
     * It does take the start-node , bomb-node , end-node into consideration.
     *
     * @returns a Set having the drawable IDs
     */
    static genRandomMaze(): Set<number> {
        let path: Set<number> = new Set();
        const size = useFrontendStateManager.getState().hexes.length;
        for (let i = 0; i < size; i++) {
            let randomID = Math.floor(Math.random() * size);
            if (randomID !== useFrontendStateManager.getState().startNodeId &&
                randomID !== useFrontendStateManager.getState().endNodeId &&
                randomID !== useFrontendStateManager.getState().bombNodeId)
                path.add(randomID);
        }
        return path;
    }

    /**
     * Generates a maze which has a column filled with walls or weights except for 2 pseudo random
     * hexes.
     * Does take care of the event in which a hex containing a bomb, start or end node is
     * assigned as a wall node.
     *
     * @returns An array of Sets.
     * Each Set contains a collection of IDs for the nodes which
     * can be blocked or changed to weight nodes on the website
     */
    static genRidges(workableColumns: number,
                     workableRows: number): Set<number> {
        // first check for nullity case
        if (workableColumns < 2 || workableRows < 2) {
            return new Set();
        }

        // array to hold the "ridges"
        let wallNodes: Set<number> = new Set();
        // function which can be used to create 2 at random entry points for the path.
        const generateRandomEntries = (colNo: number): {
            p1: number,
            p2: number
        } => {
            let p1: number = Math.floor(Math.random() * (workableRows) + (colNo * workableRows));
            let p2: number = p1 + 1;
            return {p1, p2}
        }

        for (let i: number = 0; i < workableColumns; i++) {
            if ((i & 1) === 1) {
                let entryPoints = generateRandomEntries(i);
                for (let j: number = i * workableRows; j < workableRows * (i + 1); j++) {
                    if (j !== entryPoints.p1 && j !== entryPoints.p2 && j !== useFrontendStateManager.getState().startNodeId && j !== useFrontendStateManager.getState().endNodeId && j !== useFrontendStateManager.getState().bombNodeId) {
                        wallNodes.add(j);
                    }
                }
            }
        }
        return wallNodes;
    }
}

export default MazeGenerator;