import Edge from "../../visualise-graphs/ts/Edge";

export default class EdgePair {
    edge : Edge;
    srcNode : number;
    constructor(srcNode : number , edge : Edge) {
        this.edge = edge;
        this.srcNode = srcNode;
    }
}