import useFrontendStateManager from "../api/FrontendStateManager";
import Pipe from "../api/Pipe";

/**
 * The basic maze generator class which builds the Sets required for
 * drawing the maze on the website.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
class MazeGenerator {

    /**
     * Generates a random maze.
     * It does take the start-node , bomb-node , end-node into consideration.
     *
     * @returns a Set having the drawable IDs
     */
    static genRandomMaze(): Set<number> {
        let hexes = useFrontendStateManager.getState().hexes;
        let maze: Set<number> = new Set();
        for (let i = 0; i < hexes.length; i++) {
            let randomId = Math.floor(Math.random() * hexes.length);
            let hexId = hexes[randomId].id;
            if (hexId !== useFrontendStateManager.getState().startNodeId &&
                hexId !== useFrontendStateManager.getState().endNodeId &&
                hexId !== useFrontendStateManager.getState().bombNodeId)
                maze.add(hexes[randomId].id);
        }
        return maze;
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
    static genRidges(workableColumns: number, workableRows: number): Set<number> {
        if (workableColumns < 2 || workableRows < 2) return new Set();
        // FIXME, The Hex Board Rendering update has broken this, because this was too tightly
        // coupled with the board being linear.
    }
}

export default MazeGenerator;