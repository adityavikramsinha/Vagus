import * as React from "react";
import currentState from "../ts/GlobalState";
import Hex from "./Hex";

import {updateBiIDClass, addToGraphs, updateGraph} from '../ts/Utility';
import {JSX, useEffect, useState} from "react";

const HexBoardInitializer :React.FC = () => {
    const [dimensions , setDimensions] = useState({width : 0, height : 0});

    const HEX_WIDTH = 26 ;
    const HEX_HEIGHT= 30;

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: 0.73 * window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize(); // Set initial dimensions
        window.addEventListener("resize", handleResize); // Update on resize

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const renderHex= ()=> {
        let content: JSX.Element[] = [];
        let xVar = -14.5;
        let yVar : number;
        let idVar = 0;
        const cols = Math.ceil(dimensions.width / HEX_WIDTH);
        const rows = Math.ceil(dimensions.height / HEX_HEIGHT);
        for (let i = 0; i < cols; i++) {
            // since the hexagons aren't in straight lines,
            // we have to account for odd even.
            yVar = (i & 1 )=== 1 ? -2.5 : -17;
            for (let i = 0; i < rows; i++, idVar ++) {
                content.push(<Hex x={xVar} y={yVar} id={idVar.toString()} key={idVar}/>)
                yVar += HEX_HEIGHT;
                updateGraph(xVar, yVar, idVar)
            }
            xVar +=  HEX_WIDTH;
        }

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


        // Set up the initial start and end nodes,
        // to prevent browser UI blocking, use requestAnimationFrame
        for (let i = 0; i <  idVar; i++) {
            if (i === ( rows * 3)) {
                requestAnimationFrame(() => {
                    let startCalculator = Math.floor((rows  * cols) * 0.25);
                    let endCalculator = Math.floor((rows * cols) * 0.75);

                    updateBiIDClass(startCalculator, ['no-node'], 'start-node');
                    updateBiIDClass(endCalculator, ['no-node'], 'end-node');

                    currentState.changeStartNode(startCalculator);
                    currentState.changeEndNode(endCalculator);
                });
            }
        }
        currentState.initGraph().freeze();
        return content;
    }

    if (dimensions.width > 0 && dimensions.height > 0) {
        return <div>{renderHex()}</div>;
    } else {
        return <div>Loading...</div>;
    }
}


export default HexBoardInitializer;
