import {addToGraphs} from "../../ts/Utility";

const connectHexBoard = (rows: number, cols:number, idVar:number) => {
    let columnID = 0;
    let columnIDCenter = 0;
    for (let i = 0; i <  idVar; i++) {
        // first row conditions
        if (i %  rows === 0) {
            columnID = i /  rows;
            if (columnID === 0) { // adj 2
                addToGraphs(i, i + 1)
                addToGraphs(i, i +  rows)
            }
            else if (columnID ===  cols - 1) {
                if ( cols % 2 === 0) { // adj 3
                    addToGraphs(i, i + 1)
                    addToGraphs(i, i -  rows)
                    addToGraphs(i, i -  rows + 1)
                }
                else { // adj 2
                    addToGraphs(i, i + 1)
                    addToGraphs(i, i -  rows)
                }
            }
            else if (columnID % 2 === 0) { // 3 adj
                addToGraphs(i, i + 1)
                addToGraphs(i, i -  rows)
                addToGraphs(i, i +  rows + 1)
            }
            else { // 5 adj
                addToGraphs(i, i + 1)
                addToGraphs(i, i -  rows)
                addToGraphs(i, i +  rows)
                addToGraphs(i, i -  rows + 1)
                addToGraphs(i, i +  rows + 1)
            }
        }
        // last row conditions
        else if ((i + 1) %  rows === 0) {
            columnID = (i + 1) /  rows;
            if (columnID === 1) { // adj 3
                addToGraphs(i, i - 1)
                addToGraphs(i, i +  rows)
                addToGraphs(i, i +  rows - 1)
            }
            else if (columnID ===  cols) {
                if ( cols % 2 === 0) { // adj 2
                    addToGraphs(i, i - 1)
                    addToGraphs(i, i -  rows)
                }
                else { // adj 3
                    addToGraphs(i, i - 1)
                    addToGraphs(i, i -  rows)
                    addToGraphs(i, i -  rows - 1)
                }
            }
            else if (columnID % 2 === 0) { // 3 adj
                addToGraphs(i, i - 1)
                addToGraphs(i, i -  rows)
                addToGraphs(i, i +  rows)
            }
            else { // 5 adj
                addToGraphs(i, i - 1)
                addToGraphs(i, i -  rows)
                addToGraphs(i, i +  rows)
                addToGraphs(i, i -  rows - 1)
                addToGraphs(i, i +  rows - 1)
            }
        }
        // first column conditions
        else if (i <=  rows) { // adj 4
            addToGraphs(i, i - 1)
            addToGraphs(i, i + 1)
            addToGraphs(i, i +  rows)
            addToGraphs(i, i +  rows - 1)
        }
        //last column conditions
        else if (i > ( rows * ( cols - 1))) { // adj 4
            addToGraphs(i, i - 1)
            addToGraphs(i, i + 1)
            addToGraphs(i, i -  rows)
            addToGraphs(i, i -  rows - 1)
        }
        else { // adj 6
            columnIDCenter = Math.floor(i /  rows);
            if (columnIDCenter % 2 !== 0) {
                addToGraphs(i, i - 1)
                addToGraphs(i, i + 1)
                addToGraphs(i, i -  rows)
                addToGraphs(i, i +  rows)
                addToGraphs(i, i -  rows + 1)
                addToGraphs(i, i +  rows + 1)
            }
            else if (columnIDCenter % 2 === 0) {
                addToGraphs(i, i - 1)
                addToGraphs(i, i + 1)
                addToGraphs(i, i -  rows)
                addToGraphs(i, i +  rows)
                addToGraphs(i, i -  rows - 1)
                addToGraphs(i, i +  rows - 1)
            }
        }
    }
}


export default connectHexBoard;