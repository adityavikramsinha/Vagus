import * as React from "react";
import Loading from "../Loading";
import {useEffect, useState} from "react";
import populateHexBoard from "./populateHexBoard";
import connectHexBoard from "./connectHexBoard";
import {updateBiIDClass} from "../../ts/Utility";
import currentState from "../../ts/GlobalState";
import Hex from "../hex/Hex";

/**
 * Renders the hexagonal board.
 * @returns JSX.Element
 */
const HexBoard: React.FC = () => {
    const [dimensions , setDimensions] = useState({width : 0, height : 0});
    const [isLoading, setLoading] = useState<boolean>(true);
    const HEX_WIDTH = 26 ;
    const HEX_HEIGHT= 30;

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: 0.73 * window.innerWidth,
                height: window.innerHeight,
            });
            setLoading(false);
        };
        handleResize() // Set initial dimensions
    }, []);

    let rows = Math.ceil(dimensions.height / HEX_HEIGHT);
    let cols = Math.ceil(dimensions.width / HEX_WIDTH);

    if (!isLoading) {
        let hexes = populateHexBoard(rows , cols , HEX_WIDTH, HEX_HEIGHT);
        connectHexBoard(rows,cols, hexes.length);
        requestAnimationFrame(() => {
            let startPosition = Math.floor((rows  * cols) * 0.25);
            console.log(startPosition);
            let endPosition = Math.floor((rows * cols) * 0.75);

            updateBiIDClass(startPosition, ['no-node'], 'start-node');
            updateBiIDClass(endPosition, ['no-node'], 'end-node');

            currentState.changeStartNode(startPosition);
            currentState.changeEndNode(endPosition);
        });
        currentState.initGraph().freeze();
        return (
            <div className="hex-board" id="hex-board">
                <div>
                    {hexes.map((hex,index) => <Hex x={hex.x} y={hex.y} id={hex.id} key={index}/>
                    )}
                </div>
            </div>
        )
    } else {
        return(
            <div className="hex-board" id="hex-board">
                <Loading/>
            </div>
        )
    }
};

export default HexBoard;
