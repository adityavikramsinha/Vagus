import React from "react";
import Loading from "@graph/components/Loading";
import Hex from "@graph/components/hex/Hex";
import useFrontendStateManager, {NodeAction, NodeType} from "@graph/api/FrontendStateManager";
import Syncer from "@graph/api/Syncer";
import currentState from "@graph/api/BackendStateManager";

/**
 * Renders the hexagonal board.
 * @returns JSX.Element
 */
const HexBoard: React.FC = () => {
    const setHexBoard = useFrontendStateManager(s => s.setHexBoard);
    const setHexBoardDimensions = useFrontendStateManager(state => state.setHexBoardDimensions);
    const changeNode = useFrontendStateManager(state => state.changeNode);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const {
        HEX_WIDTH,
        HEX_HEIGHT
    } = useFrontendStateManager(state => state.hexDimensions)

    React.useEffect(() => {
        const handleResize = () => {
            const width = 0.73 * window.innerWidth;
            const height = window.innerHeight;
            const rows = Math.ceil(height / HEX_HEIGHT);
            const cols = Math.ceil(width / HEX_WIDTH);
            setHexBoard(rows, cols, HEX_WIDTH, HEX_HEIGHT);
            Syncer.setGraph(rows, cols, rows * cols);
            setLoading(false);
            let startPosition = Math.floor((rows * cols) * 0.25);
            let endPosition = Math.floor((rows * cols) * 0.75);
            changeNode(NodeType.START_NODE, NodeAction.SET, startPosition);
            changeNode(NodeType.END_NODE, NodeAction.SET, endPosition);
            setHexBoardDimensions({width, height});
            currentState.initGraph().freeze();
        };
        handleResize() // First time when mount has happened

        // Attach resize event listener
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const hexes = useFrontendStateManager(s => s.hexes);
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
