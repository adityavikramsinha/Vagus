import * as React from "react";
import HexBoardInitializer from "./HexBoardInitializer";

/**
 * Renders the hexagonal board.
 * @returns JSX.Element
 */
const HexBoard: React.FC = () => {
    return (
        <div className="hex-board" id="hex-board">
            <HexBoardInitializer />
        </div>
    );
};

export default HexBoard;
