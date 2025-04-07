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
