import BackendStateManager from "@graph/api/BackendStateManager";
import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import {NOTSET} from "@graph/ts/Types";
import Graph from "@graph/ts/Graph";
import Pipe from "./Pipe";

export default class Syncer {

    static syncInitialGraph() {
        Graph.copy(BackendStateManager.initGraph(), BackendStateManager.graph(), 1);
    }

    static setEdge(source: number, dest: number) {
        BackendStateManager.graph().addEdge(source, dest, 1);
        BackendStateManager.initGraph().addEdge(source, dest, 1);
    }

    static setNode(x: number, y: number, id: number) {
        BackendStateManager.graph().addNode(id);
        BackendStateManager.graph().setNodeCoords(id, {x: x, y: y});
        BackendStateManager.initGraph().addNode(id);
        BackendStateManager.initGraph().setNodeCoords(id, {x: x, y: y});
    }

    static removeNode(id: number) {
        BackendStateManager.graph().rmNode(id);
    }

    // STABLE.
    static setGraph(
        rows: number,
        cols: number,
    ) {
        // If we are setting the graphs,
        // then we must ensure that the Initial Graph is clean and does not
        // hold reference to any previous object, or else it will become soup.
        BackendStateManager.resetInitialGraph();
        // We don't need to reset the current graph. Since it is always updating, it doesn't
        // make sense for us to reset it and clean it up because for each run it
        // is reconstructed anyways.


        // New implementation,
        // 1st one is col, 2nd one is row.
        // see https://www.redblobgames.com/grids/hexagons/#coordinates-doubled for visualisation + logic.
        const offsets = [
            [0, 2], [0, -2], [1, -1], [1, + 1], [-1, -1], [-1, +1]
        ];

        // Absolutely gorgeous.
        for (let col = 0; col < cols; ++col) {
            const startDoubledRow = (col & 1) === 1 ? 1 : 0;
            for (let row = 0, doubledCoordinates = startDoubledRow; row < rows; ++row, doubledCoordinates += 2) {
                const fromId = Pipe.pairToUUID(doubledCoordinates, col);
                for (const [dc, dr] of offsets) {
                    // dc, dx (differential element?) and Delta Column and Delta Double Coordinates (c+dc)
                    const Dc = col + dc;
                    const Ddc = doubledCoordinates + dr;
                    // Bounds: col [0, cols), doubledRow [0, 2 * rows)
                    if (Dc >= 0 && Dc < cols && Ddc >= 0 && Ddc < 2 * rows) {
                        const toId = Pipe.pairToUUID(Ddc, Dc);
                        Syncer.setEdge(fromId, toId);
                    }
                }
            }
        }
    }

    static updateEdge(source: number, dest: number) {
        const srcNode = BackendStateManager.graph().nodes().get(source);
        const destNode = BackendStateManager.graph().nodes().get(dest);
        srcNode.updateCostTo(destNode, 10);
    }

    static cleanHexBoard() {
        useFrontendStateManager.setState({visitedNodes: new Map()});
        useFrontendStateManager.setState({pathNodes: new Set()});
    }

    static clearHexBoard() {
        Syncer.cleanHexBoard();
        if(useFrontendStateManager.getState().executing) {
            useFrontendStateManager.setState({executing : false});
            return;
        }
        useFrontendStateManager.setState({
            hexBoard: {
                [NOTSET]: NodeType.START_NODE
            }
        })
        let prevStartNode = useFrontendStateManager.getState().startNodeId;
        let prevEndNode = useFrontendStateManager.getState().endNodeId
        let bombNode = useFrontendStateManager.getState().bombNodeId;
        Syncer.syncInitialGraph();
        useFrontendStateManager.getState().hexBoard[prevStartNode] = NodeType.START_NODE;
        useFrontendStateManager.getState().hexBoard[prevEndNode] = NodeType.END_NODE;
        if(bombNode !== NOTSET)
            useFrontendStateManager.getState().hexBoard[bombNode] = NodeType.BOMB_NODE;
    }

    static async supervise(fn: ()=> Promise<void> | void) {
        if (!useFrontendStateManager.getState().executing) return;
        await fn();
    }
}