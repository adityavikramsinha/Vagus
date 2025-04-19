import {HexProps} from "@graph/components/hex/Hex";
import Pipe from "@graph/api/Pipe";

/**
 * Based on the Dimensions of the Hex board and a single Hex, this returns an array of Hex's each with
 * its associated x coordinate , y coordinate and id.
 * @param rows of the Hex Board
 * @param cols of hte Hex Board
 * @param HEX_WIDTH
 * @param HEX_HEIGHT
 */
const getHexes = (rows: number, cols: number, HEX_WIDTH: number, HEX_HEIGHT: number) => {
    let hexes: HexProps[] = [];
    let x = -14.5;

    for (let col = 0; col < cols; col++, x += HEX_WIDTH) {
        const isOddCol = (col & 1) === 1;
        let y = isOddCol ? -2.5 : -17;

        // see https://www.redblobgames.com/grids/hexagons/#coordinates-doubled for visualisation
        let doubledCoordinates = isOddCol ? 1 : 0;

        for (let row = 0; row < rows; row++, doubledCoordinates += 2, y += HEX_HEIGHT) {
            const id = Pipe.pairToUUID(doubledCoordinates, col);
            hexes.push({ x, y, id });
        }
    }

    return hexes;
};

export default getHexes;
