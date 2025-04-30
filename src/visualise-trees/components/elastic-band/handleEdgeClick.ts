import useTreeStore from "../../../stores/TreeStore";

/**
 * Handle the Right Click on an Elastic Connector'. This will remove the edge.
 * @param srcBobId
 * @param destBobId
 */
const handleEdgeClick = (srcBobId: string, destBobId: string) => {
    const edgeSet = useTreeStore.getState().edgeList.get(srcBobId);
    if (edgeSet) {
        const newEdgeSet = new Set(
            [...edgeSet].filter(edge => edge.dest.getData() !== destBobId)
        );
        const newEdgeList = new Map(useTreeStore.getState().edgeList);
        newEdgeList.set(srcBobId, newEdgeSet);
        useTreeStore.setState({edgeList: newEdgeList})
    }
}

export default handleEdgeClick;