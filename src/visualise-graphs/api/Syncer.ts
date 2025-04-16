import BackendStateManager from "@graph/api/BackendStateManager";
import useFrontendStateManager, {NodeType} from "@graph/api/FrontendStateManager";
import {NOTSET} from "@graph/ts/Types";
import Graph from "@graph/ts/Graph";

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

    static setGraph(
        rows: number,
        cols: number,
        ids: number
    ) {
        let columnID = 0;
        let columnIDCenter = 0;
        for (let i = 0; i < ids; i++) {
            // first row conditions
            if (i % rows === 0) {
                columnID = i / rows;
                if (columnID === 0) { // adj 2
                    Syncer.setEdge(i, i + 1)
                    Syncer.setEdge(i, i + rows)
                } else if (columnID === cols - 1) {
                    if (cols % 2 === 0) { // adj 3
                        Syncer.setEdge(i, i + 1)
                        Syncer.setEdge(i, i - rows)
                        Syncer.setEdge(i, i - rows + 1)
                    } else { // adj 2
                        Syncer.setEdge(i, i + 1)
                        Syncer.setEdge(i, i - rows)
                    }
                } else if (columnID % 2 === 0) { // 3 adj
                    Syncer.setEdge(i, i + 1)
                    Syncer.setEdge(i, i - rows)
                    Syncer.setEdge(i, i + rows + 1)
                } else { // 5 adj
                    Syncer.setEdge(i, i + 1)
                    Syncer.setEdge(i, i - rows)
                    Syncer.setEdge(i, i + rows)
                    Syncer.setEdge(i, i - rows + 1)
                    Syncer.setEdge(i, i + rows + 1)
                }
            }
            // last row conditions
            else if ((i + 1) % rows === 0) {
                columnID = (i + 1) / rows;
                if (columnID === 1) { // adj 3
                    Syncer.setEdge(i, i - 1)
                    Syncer.setEdge(i, i + rows)
                    Syncer.setEdge(i, i + rows - 1)
                } else if (columnID === cols) {
                    if (cols % 2 === 0) { // adj 2
                        Syncer.setEdge(i, i - 1)
                        Syncer.setEdge(i, i - rows)
                    } else { // adj 3
                        Syncer.setEdge(i, i - 1)
                        Syncer.setEdge(i, i - rows)
                        Syncer.setEdge(i, i - rows - 1)
                    }
                } else if (columnID % 2 === 0) { // 3 adj
                    Syncer.setEdge(i, i - 1)
                    Syncer.setEdge(i, i - rows)
                    Syncer.setEdge(i, i + rows)
                } else { // 5 adj
                    Syncer.setEdge(i, i - 1)
                    Syncer.setEdge(i, i - rows)
                    Syncer.setEdge(i, i + rows)
                    Syncer.setEdge(i, i - rows - 1)
                    Syncer.setEdge(i, i + rows - 1)
                }
            }
            // first column conditions
            else if (i <= rows) { // adj 4
                Syncer.setEdge(i, i - 1)
                Syncer.setEdge(i, i + 1)
                Syncer.setEdge(i, i + rows)
                Syncer.setEdge(i, i + rows - 1)
            }
            //last column conditions
            else if (i > (rows * (cols - 1))) { // adj 4
                Syncer.setEdge(i, i - 1)
                Syncer.setEdge(i, i + 1)
                Syncer.setEdge(i, i - rows)
                Syncer.setEdge(i, i - rows - 1)
            } else { // adj 6
                columnIDCenter = Math.floor(i / rows);
                if (columnIDCenter % 2 !== 0) {
                    Syncer.setEdge(i, i - 1)
                    Syncer.setEdge(i, i + 1)
                    Syncer.setEdge(i, i - rows)
                    Syncer.setEdge(i, i + rows)
                    Syncer.setEdge(i, i - rows + 1)
                    Syncer.setEdge(i, i + rows + 1)
                } else if (columnIDCenter % 2 === 0) {
                    Syncer.setEdge(i, i - 1)
                    Syncer.setEdge(i, i + 1)
                    Syncer.setEdge(i, i - rows)
                    Syncer.setEdge(i, i + rows)
                    Syncer.setEdge(i, i - rows - 1)
                    Syncer.setEdge(i, i + rows - 1)
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
        useFrontendStateManager.setState({
            hexBoard: {
                [NOTSET]: NodeType.START_NODE
            },
            executingRandomWalk : false
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
}