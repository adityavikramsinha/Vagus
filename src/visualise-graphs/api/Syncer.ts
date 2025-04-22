import BackendStateManager from "@graph/api/BackendStateManager";
import useGraphStore, {NodeType} from "@graph/api/FrontendStateManager";
import {NOTSET} from "@graph/ts/Types";
import Graph from "@graph/ts/Graph";
import Pipe from "./Pipe";
import {HexProps} from "../components/hex/Hex";

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

    /**
     * Set up the graph by initialising nodes that will be a part of the graph
     * but not connecting them,
     * @param hexes holds the information for the nodes
     */
    static setGraph (hexes : HexProps []) {
        hexes.forEach(({x,y,id})=> Syncer.setNode(x, y, id));
        return this;
    }

    // STABLE. (v2.0.0)
    static connectGraph(
        rows: number,
        cols: number,
    ) {
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
        return this;
    }

    static updateEdge(source: number, dest: number) {
        const srcNode = BackendStateManager.graph().nodes().get(source);
        const destNode = BackendStateManager.graph().nodes().get(dest);
        srcNode.updateCostTo(destNode, 10);
    }

    static cleanHexBoard() {
        useGraphStore.setState({visitedNodes: new Map()});
        useGraphStore.setState({pathNodes: new Set()});
    }

    static clearHexBoard() {
        Syncer.cleanHexBoard();
        if(useGraphStore.getState().executing) {
            useGraphStore.setState({executing : false});
            return;
        }
        useGraphStore.setState({
            hexBoard: {
                [NOTSET]: NodeType.START_NODE
            }
        })
        let prevStartNode = useGraphStore.getState().startNodeId;
        let prevEndNode = useGraphStore.getState().endNodeId
        let bombNode = useGraphStore.getState().bombNodeId;
        Syncer.syncInitialGraph();
        useGraphStore.getState().hexBoard[prevStartNode] = NodeType.START_NODE;
        useGraphStore.getState().hexBoard[prevEndNode] = NodeType.END_NODE;
        if(bombNode !== NOTSET)
            useGraphStore.getState().hexBoard[bombNode] = NodeType.BOMB_NODE;
    }

    static async supervise(fn: ()=> Promise<void> | void) {
        if (!useGraphStore.getState().executing) return;
        await fn();
    }
}