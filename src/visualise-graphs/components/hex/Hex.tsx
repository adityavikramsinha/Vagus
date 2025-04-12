import React from "react";

import HexIcon from "./HexIcon";
import useFrontendStateManager from "../../store/store";
import {NOTSET} from "../../ts/Types";
import cn from "../../css/cn";

export type HexProps = {
    x: number,
    y: number,
    id: number
}
/**
 * @returns JSX.Element which has the rendered Hex along with its id
 */
const Hex : React.FC<HexProps> = ({x , y , id}) => {
    const isStartNode = useFrontendStateManager(state=>state.startNodeId === id);
    const isEndNode = useFrontendStateManager(state=>state.endNodeId ===id);
    const isBombNode = useFrontendStateManager(state=>state.bombNodeId === id);
    const changeStartNodeId = useFrontendStateManager(state=>state.changeStartNodeId);
    const changeEndNodeId = useFrontendStateManager(state=>state.changeEndNodeId);
    const changeBombNodeId = useFrontendStateManager(state=>state.changeBombNodeId)
    const [isWallNode, toggleIsWallNode] = React.useState(false);
    const [isWeightNode , toggleIsWeightNode] = React.useState(false);
    const activeFilesIo = useFrontendStateManager(state=>state.activeFiles).io;

    const handleHexClick = () => {
        if(isStartNode){
            if(activeFilesIo === 'io-1') return;
            else changeStartNodeId(NOTSET);
        }
        else if(isEndNode) {
            if(activeFilesIo === 'io-2') return;
            else changeEndNodeId(NOTSET);
        }
        else if(isBombNode){
            if(activeFilesIo === 'io-3') return;
            else changeBombNodeId(NOTSET);
        }
        else if (isWeightNode) {
            if (activeFilesIo === 'io-4') return;
            toggleIsWeightNode(false);
        }
        else if(isWallNode) {
            if(activeFilesIo === 'io-5') return;
            toggleIsWallNode(false);
        }
        else {
            if(activeFilesIo === 'io-1') changeStartNodeId(id);
            else if (activeFilesIo === 'io-2') changeEndNodeId(id);
            else if (activeFilesIo === 'io-3') changeBombNodeId(id);
            else if (activeFilesIo === 'io-4') toggleIsWeightNode(true);
            else if (activeFilesIo === 'io-5') toggleIsWallNode(true)
        }
    }
    const styles : React.CSSProperties = {
        left : `${x}px`,
        top : `${y}px`,
    }
    let classes = cn({
        "prop-holder" : true,
        "start-node" : isStartNode,
        "bomb-node" : isBombNode,
        "end-node" : isEndNode,
        "weight-node" : isWeightNode
    });

    return (
        <div className="hexagon"  style={styles} onClick={handleHexClick}>
            {/*FIXME there is a # here, it needs to be moved global*/}
            <HexIcon style = {{fill: isWallNode ? "#313244" : ""}}/>
            <div className={classes}/>
        </div>
    );
}

export default Hex;
