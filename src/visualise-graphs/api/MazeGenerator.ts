import useGraphStore from '../../stores/GraphStore';
import Pipe from './Pipe';

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
    static genRandomMaze(): Set<string> {
        const hexes = useGraphStore.getState().hexes;
        const maze: Set<string> = new Set();
        for (let i = 0; i < hexes.length; i++) {
            const randomId = Math.floor(Math.random() * hexes.length);
            const hexId = hexes[randomId].id;
            if (
                hexId !== useGraphStore.getState().startId &&
                hexId !== useGraphStore.getState().endId &&
                hexId !== useGraphStore.getState().bombNodeId
            )
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
    static genRidges(workableColumns: number, workableRows: number): Set<string> {
        if (workableColumns < 2 || workableRows < 2) return new Set();

        const maze = new Set<string>();

        const getDoors = (rows: number): [number, number] => {
            const a = Math.floor(Math.random() * rows);
            let b = Math.floor(Math.random() * (rows - 1));
            if (b >= a) b += 1; // avoid collisions

            return [a, b];
        };

        for (let col = 0; col < workableColumns; col += 2) {
            // keep 2 random hex's/nodes in the column free to move around.
            const [door1, door2] = getDoors(workableRows);
            for (
                let row = 0, doubledCoordinates = (col & 1) === 1 ? 1 : 0;
                row < workableRows;
                ++row, doubledCoordinates += 2
            ) {
                const id = Pipe.pairToUUID(doubledCoordinates, col).toString();
                const startNodeId = useGraphStore.getState().startId;
                const endNodeId = useGraphStore.getState().endId;
                const bombNodeId = useGraphStore.getState().bombNodeId;
                if (
                    door1 !== row &&
                    door2 !== row &&
                    id !== startNodeId &&
                    id !== endNodeId &&
                    id !== bombNodeId
                )
                    maze.add(id);
            }
        }
        return maze;
    }
}

export default MazeGenerator;
