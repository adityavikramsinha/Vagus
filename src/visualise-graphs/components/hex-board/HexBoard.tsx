import React from "react";
import Loading from "../Loading";
import connectHexBoard from "./connectHexBoard";
import Hex from "../hex/Hex";
import useFrontendStateManager from "../../store/store";

/**
 * Renders the hexagonal board.
 * @returns JSX.Element
 */
const HexBoard: React.FC = () => {
    const setHexBoard = useFrontendStateManager(s=>s.setHexBoard);
    const changeStartNodeId = useFrontendStateManager(s=>s.changeStartNodeId);
    const changeEndNodeId = useFrontendStateManager(s=>s.changeEndNodeId);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const HEX_WIDTH = 26 ;
    const HEX_HEIGHT= 30;

    React.useEffect(() => {
        const handleResize = () => {
            const width= 0.73 * window.innerWidth;
            const height=  window.innerHeight;
            const rows = Math.ceil(height / HEX_HEIGHT);
            const cols = Math.ceil(width / HEX_WIDTH);
            setHexBoard(rows , cols , HEX_WIDTH, HEX_HEIGHT);
            connectHexBoard(rows,cols, rows* cols);
            setLoading(false);
            requestAnimationFrame(() => {
                let startPosition = Math.floor((rows  * cols) * 0.25);
                let endPosition = Math.floor((rows * cols) * 0.75);
                changeStartNodeId(startPosition);
                changeEndNodeId(endPosition);
            });
        };
        handleResize()
    }, []);
    const hexes = useFrontendStateManager(s=>s.hexes);
    if (!isLoading) {
        return (
            <div className="hex-board" id="hex-board">
                <div>
                    {hexes.map((hex) =>
                        <Hex
                            x={hex.x}
                            y={hex.y}
                            id={hex.id}
                            key = {hex.id}
                        />
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
