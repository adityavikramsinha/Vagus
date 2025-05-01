import Graph from "@graph/ts/Graph";

export default  class BackendStateManager {
    static graph= new Graph ((a,b)=> a.localeCompare(b));
    static resetGraph () {
        BackendStateManager.graph= new Graph ((a , b)=> a.localeCompare(b));
    }
}
