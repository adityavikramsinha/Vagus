import useTreeStore from "../../../stores/TreeStore";

const handleEdgeClick = (srcBobId: string, destBobId: string) => {
    const activeIoFile = useTreeStore.getState().activeFiles.io;
    if (activeIoFile === 'io-3') {
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
}

export default handleEdgeClick;