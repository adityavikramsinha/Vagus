import {BobProps} from "../bob/Bob";
import useTreeStore from "../../../stores/TreeStore";
import BackendStateManager from "../../api/BackendStateManager";


const handleBlackBoardClick = (
    nodes : Map<string, BobProps>,
    addBob : BobProps
) => {
    if (useTreeStore.getState().activeFiles.io === "io-1"){
        useTreeStore.setState({nodes: new Map(nodes).set(addBob.id, addBob)})
        BackendStateManager.graph.addNode(addBob.id , addBob.x.get() , addBob.y.get());
    }
}

export default handleBlackBoardClick;
