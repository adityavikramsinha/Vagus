import currentState from "./GlobalState";

export const updateIDClass = (id: string, classesRM: string[], classesADD: string[]): void => {
  document.getElementById(id).classList.remove(...classesRM);
  document.getElementById(id).classList.add(...classesADD);
}

export const updateBiIDClass = (id: number, classToRM: string[], classToAdd: string): void => {
  updateIDClass(`props-${id}`, [...classToRM], [classToAdd]);
  updateIDClass(`svg-${id}`, [...classToRM], [`svg-${classToAdd}`]);
}

export const extractIDs = (rawID): [id1: string, id2: string] => {
  return [`props-${rawID}`, `svg-${rawID}`];
}

export const addToGraphs = (source: number, destination: number): void => {
  currentState.graph().addEdge(source, destination, 1);
  currentState.initGraph().addEdge(source, destination, 1);
}