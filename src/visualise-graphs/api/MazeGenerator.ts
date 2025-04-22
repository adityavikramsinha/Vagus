import useGraphStore from "./FrontendStateManager";
import Pipe from "./Pipe";

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
        let hexes = useGraphStore.getState().hexes;
        let maze: Set<number> = new Set();
        for (let i = 0; i < hexes.length; i++) {
            let randomId = Math.floor(Math.random() * hexes.length);
            let hexId = hexes[randomId].id;
            if (hexId !== useGraphStore.getState().startNodeId &&
                hexId !== useGraphStore.getState().endNodeId &&
                hexId !== useGraphStore.getState().bombNodeId)
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

        let maze = new Set<number>()

        const getDoors = (rows : number) :  [number, number] => {
            const a = Math.floor(Math.random() * rows);
            let b = Math.floor(Math.random() * (rows - 1));
            if (b >= a) b += 1; // avoid collisions

            return [a, b];
        }

        for (let col = 0 ; col<workableColumns ;col +=2){
            // keep 2 random hex's/nodes in the column free to move around.
            let [door1, door2] = getDoors(workableRows);
            for (let row = 0 , doubledCoordinates = (col & 1) ===1 ? 1 : 0; row <workableRows ; ++row , doubledCoordinates +=2) {
                const id = Pipe.pairToUUID(doubledCoordinates, col);
                const startNodeId = useGraphStore.getState().startNodeId;
                const endNodeId = useGraphStore.getState().endNodeId;
                const bombNodeId = useGraphStore.getState().bombNodeId;
                if(door1 !== row &&
                    door2 !== row &&
                    id !== startNodeId &&
                    id !== endNodeId &&
                    id !== bombNodeId
                ) maze.add(id);
            }
        }
        return maze;
    }
}

export default MazeGenerator;