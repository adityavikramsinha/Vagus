import {HexProps} from "../hex/Hex";
import {updateGraph} from "../../ts/Utility";

const populateHexBoard = (rows : number, cols :number, HEX_WIDTH:number, HEX_HEIGHT:number ) => {
    console.log('re-render requested')
    let content: HexProps[] = [];
    let xVar = -14.5;
    let yVar : number;
    let idVar = 0;
    for (let i = 0; i < cols; i++, xVar +=  HEX_WIDTH) {
        // since the hexagons aren't in straight lines,
        // we have to account for odd even.
        yVar = (i & 1 )=== 1 ? -2.5 : -17;
        for (let j = 0; j < rows; j++, idVar ++) {
            content.push({ x:xVar, y:yVar, id:idVar})
            yVar += HEX_HEIGHT;
            updateGraph(xVar, yVar, idVar)
        }
    }
    return content;
}
export default populateHexBoard;