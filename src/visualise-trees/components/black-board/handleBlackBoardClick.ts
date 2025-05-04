import {BobProps} from "../bob/Bob";
import useTreeStore, {VertexActions} from "../../../stores/TreeStore";
import BackendStateManager from "../../api/BackendStateManager";


const handleBlackBoardClick = (
    addBob: BobProps
) => {
    if (useTreeStore.getState().activeFiles.io === "io-1") {
        useTreeStore.getState().dispatch({type: VertexActions.ADD, bob: addBob})
        BackendStateManager.graph.addNode(addBob.id, addBob.x.get(), addBob.y.get());
    }
}

export default handleBlackBoardClick;
