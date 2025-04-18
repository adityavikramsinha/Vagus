import {HexProps} from "../hex/Hex";
import Syncer from "../../api/Syncer";
import Pipe from "../../api/Pipe";
const populateHexBoard = (rows: number, cols: number, HEX_WIDTH: number, HEX_HEIGHT: number) => {
    let content: HexProps[] = [];
    let x = -14.5;

    for (let col = 0; col < cols; col++, x += HEX_WIDTH) {
        const isOddCol = (col & 1) === 1;
        let y = isOddCol ? -2.5 : -17;

        // see https://www.redblobgames.com/grids/hexagons/#coordinates-doubled for visualisation
        let doubledCoordinates = isOddCol ? 1 : 0;

        for (let row = 0; row < rows; row++, doubledCoordinates += 2, y += HEX_HEIGHT) {
            const id = Pipe.pairToUUID(doubledCoordinates, col);
            content.push({ x, y, id });
            Syncer.setNode(x, y, id);
        }
    }

    return content;
};

export default populateHexBoard;
