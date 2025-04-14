import currentState from "../ts/GlobalState";
import useFrontendStateManager, {NodeAction, NodeType} from "./FrontendStateManager";
import {NOTSET} from "../ts/Types";

export default class Syncer {
    static setEdge(source: number, dest: number) {
        currentState.graph().addEdge(source, dest, 1);
        currentState.initGraph().addEdge(source, dest, 1);
    }

    static setNode(x: number, y: number, id: number) {
        currentState.graph().addNode(id);
        currentState.graph().setNodeCoords(id, {x: x, y: y});
        currentState.initGraph().addNode(id);
        currentState.initGraph().setNodeCoords(id, {x: x, y: y});
    }

    static removeNode (id : number){
        currentState.graph().rmNode(id);
    }

    static setGraph(
        rows: number,
        cols: number,
        idVar: number
    ) {
        let columnID = 0;
        let columnIDCenter = 0;
        for (let i = 0; i < idVar; i++) {
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

    static updateEdge(source :number, dest:number) {
        const srcNode = currentState.graph().nodes().get(source);
        const destNode = currentState.graph().nodes().get(dest);
        srcNode.updateCostTo(destNode, 10);
    }

    static cleanHexBoard () {
        useFrontendStateManager.setState({visitedNodes : new Set()});
        useFrontendStateManager.setState({pathNodes : new Set()});
    }

    static clearHexBoard () {
        // TODO, wrk.
    }
}