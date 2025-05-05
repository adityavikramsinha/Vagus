import BackendStateManager from "@tree/api/BackendStateManager";
import useTreeStore from "@/stores/TreeStore";
import Animator from "../../api/Animator";

const handleStartButtonClick = () => {
    useTreeStore.setState({block: true, executing: true});
    console.log(BackendStateManager.graph);
    setTimeout(async ()=> {
        await Animator.animateVisitedVertices()
        useTreeStore.setState({block : false , executing : false});
    })
}
export default handleStartButtonClick;
