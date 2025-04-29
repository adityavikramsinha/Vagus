import React from "react";
import Loading from "../../../components/Loading";
import Hex from "@graph/components/hex/Hex";
import useGraphStore, {NodeAction, NodeType} from "../../../stores/GraphStore";
import Syncer from "@graph/api/Syncer";
import BackendStateManager from "@graph/api/BackendStateManager";
import Pipe from "../../api/Pipe";
import getHexes from "./getHexes";

/**
 * Renders the hexagonal board.
 * @returns JSX.Element
 */
const HexBoard: React.FC = () => {
    const setHexBoardDimensions = useGraphStore(state => state.setHexBoardDimensions);
    const changeNode = useGraphStore(state => state.changeNode);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const {
        HEX_WIDTH,
        HEX_HEIGHT
    } = useGraphStore(state => state.hexDimensions)

    React.useEffect(() => {
        const handleResize = () => {

            // If we are setting the graphs,
            // then we must ensure that the Initial Graph is clean and does not
            // hold reference to any previous object, or else it will become soup.
            BackendStateManager.resetInitialGraph();
            // We don't need to reset the current graph. Since it is always updating, it doesn't
            // make sense for us to reset it and clean it up because for each run it
            // is reconstructed anyway.

            const width = 0.73 * window.innerWidth;
            const height = window.innerHeight;
            const rows = Math.ceil(height / HEX_HEIGHT);
            const cols = Math.ceil(width / HEX_WIDTH);

            useGraphStore.setState({hexes: getHexes(rows, cols, HEX_WIDTH, HEX_HEIGHT)});
            Syncer.setGraph(useGraphStore.getState().hexes)
                  .connectGraph(rows, cols);
            setLoading(false);
            let startPosition = Math.floor((rows * cols) * 0.25);
            let endPosition = Math.floor((rows * cols) * 0.75);

            // need to be able to extract the id from flat list start & end positions.
            const getDoubledCoordinatesPair = (index: number) => {
                const col = Math.floor(index / rows);
                const row = index % rows;
                const doubledRow = (col & 1) === 1 ? 1 + row * 2 : row * 2;
                return [doubledRow, col];
            };
            const [startRow, startCol] = getDoubledCoordinatesPair(startPosition);
            const [endRow, endCol] = getDoubledCoordinatesPair(endPosition);

            // get the Ids from the row & col.
            const startId = Pipe.pairToUUID(startRow, startCol).toString();
            const endId = Pipe.pairToUUID(endRow, endCol).toString();
            changeNode(NodeType.START_NODE, NodeAction.SET, startId);
            changeNode(NodeType.END_NODE, NodeAction.SET, endId);
            setHexBoardDimensions({width, height});

            // We must now freeze the initial graph,
            // so that no further changes can occur.
            BackendStateManager.initGraph().freeze();
        };
        handleResize() // First time when mount has happened

        // Attach resize event listener
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const hexes = useGraphStore(s => s.hexes);
    return (
        <div className="relative overflow-hidden w-[79vw] flex content-center justify-center" id="hex-board">
            {isLoading ? <Loading/> : hexes.map(({x, y, id}) =>
                <Hex
                    x={x}
                    y={y}
                    id={id}
                    key={id}
                />
            )}
        </div>
    )
}

export default HexBoard;
