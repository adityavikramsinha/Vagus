import React from "react";
import Loading from "../Loading";
import connectHexBoard from "./connectHexBoard";
import Hex from "../hex/Hex";
import useStateManager, {NodeAction, NodeType} from "../../store/store";

/**
 * Renders the hexagonal board.
 * @returns JSX.Element
 */
const HexBoard: React.FC = () => {
    const setHexBoard = useStateManager(s => s.setHexBoard);
    const setHexBoardDimensions = useStateManager(state => state.setHexBoardDimensions);
    const changeNode = useStateManager(state => state.changeNode);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const {
        HEX_WIDTH,
        HEX_HEIGHT
    } = useStateManager(state => state.hexDimensions)

    React.useEffect(() => {
        const handleResize = () => {
            const width = 0.73 * window.innerWidth;
            const height = window.innerHeight;
            const rows = Math.ceil(height / HEX_HEIGHT);
            const cols = Math.ceil(width / HEX_WIDTH);
            setHexBoard(rows, cols, HEX_WIDTH, HEX_HEIGHT);
            connectHexBoard(rows, cols, rows * cols);
            setLoading(false);
            let startPosition = Math.floor((rows * cols) * 0.25);
            let endPosition = Math.floor((rows * cols) * 0.75);
            changeNode(NodeType.START_NODE, NodeAction.SET, startPosition);
            changeNode(NodeType.END_NODE, NodeAction.SET, endPosition);
            setHexBoardDimensions({width, height});
        };
        handleResize() // First time when mount has happened

        // Attach resize event listener
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const hexes = useStateManager(s => s.hexes);
    if (!isLoading) {
        return (
            <div className="hex-board" id="hex-board">
                {hexes.map((hex) =>
                    <Hex
                        x={hex.x}
                        y={hex.y}
                        id={hex.id}
                        key={hex.id}
                    />
                )}
            </div>
        )
    } else {
        return (
            <div className="hex-board" id="hex-board">
                <Loading/>
            </div>
        )
    }
};

export default HexBoard;
