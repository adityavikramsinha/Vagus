import BackendStateManager from "@tree/api/BackendStateManager";
import useTreeStore from "@/stores/TreeStore";

const handleStartButtonClick = () => {
    useTreeStore.setState({block: true, executing: true});
    console.log(BackendStateManager.graph);
    setTimeout(()=>useTreeStore.setState({block: false, executing: false}), 10000)
}
export default handleStartButtonClick;
