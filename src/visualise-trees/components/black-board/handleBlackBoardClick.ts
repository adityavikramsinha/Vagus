import {BobProps} from "../bob/Bob";
import {NOTSET_t} from "../../../visualise-graphs/ts/Types";
import useTreeStore from "../../../stores/TreeStore";

const handleBlackBoardClick = (
    nodes : Map<number, BobProps | NOTSET_t>,
    addBob : BobProps
) => {
    if (useTreeStore.getState().activeFiles.io === "io-1"){
        useTreeStore.setState({nodes: new Map(nodes).set(addBob.id, addBob)})
    }
}

export default handleBlackBoardClick;