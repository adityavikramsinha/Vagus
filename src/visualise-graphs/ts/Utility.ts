import currentState from "./GlobalState";

export const updateIDClass = (id: string, classesRM: string[], classesADD: string[]): void => {
  let element = document.getElementById(id)
    if(element!==null) {
        element.classList.remove(...classesRM);
        element.classList.add(...classesADD);
    }
}

export const updateBiIDClass = (id: number, classToRM: string[], classToAdd: string): void => {
  updateIDClass(`props-${id}`, [...classToRM], [classToAdd]);
  updateIDClass(`svg-${id}`, [...classToRM], [`svg-${classToAdd}`]);
}

export const extractIDs = (rawID: number): [id1: string, id2: string] => {
  return [`props-${rawID}`, `svg-${rawID}`];
}

export const addToGraphs = (source: number, destination: number): void => {
  currentState.graph().addEdge(source, destination, 1);
  currentState.initGraph().addEdge(source, destination, 1);
}

export const updateGraph = (x:number , y : number , id : number)=>{
  currentState.graph().addNode(id);
  currentState.graph().setNodeCoords(id, { x: x, y: y });
  currentState.initGraph().addNode(id);
  currentState.initGraph().setNodeCoords(id, { x: x, y: y });
}


/**
 * Removes all the nodes of a certain type from the board.
 * @param node The class of the node type that has to be removed from the board.
 * @return void
 */
const removeAllNodes = (node: string): void => {
    let nodes = document.querySelectorAll(`.${node}`);
    let svgNode = document.querySelectorAll(`.svg-${node}`);
    for (let i = 0; i < nodes.length; i++) {
        const ele = nodes[i] as HTMLElement;
        ele.classList.remove(node, 'node-hover');
        ele.classList.add('no-node');
        const svgEle = svgNode[i] as HTMLElement;
        svgEle.classList.remove(`svg-${node}`);
        svgEle.classList.add('no-node', 'icon');
    }
}

export const removeAllClasses = (time: number, optional: string[]) => {
    setTimeout(() => {
        removeAllNodes('path-node');
        removeAllNodes('visited-node');
        removeAllNodes('visited-node-bomb');
        removeAllNodes('un-path-node');
        removeAllNodes('un-visited-node');
        optional.forEach((x: string) => removeAllNodes(x));
    }, time)
}
