import React from "react";

import HexIcon from "./HexIcon";
import useFrontendStateManager from "../../store/store";
import {updateHexIcon} from "../../ts/HexBoardUpdate";
import cn from "../../css/cn";
import currentState from "../../ts/GlobalState";

export type HexProps = {
    x: number,
    y: number,
    id: number
}


// export enum HexType  {
//     START     = 'start-node',
//     END       = 'end-node',
//     WEIGHT    = 'weight-node',
//     WALL      = 'wall-node',
//     VISITED   = 'visited-node',
//     UNVISITED = 'unvisited-node',
//     PATH      = 'path-node',
//     BOMB      = 'bomb-node',
//     NO_NODE   = 'no-node',
// }

/**
 * Returns a Hex Component that is ready to be rendered
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
        console.log(id);
        if(isStartNode){
            // we know it is the start Node
            if(activeFilesIo==='io-1')
                return;
            else if (activeFilesIo==='io-2'){
                changeEndNodeId(id);
            }

        }
        else if(isEndNode) {
            // we know it is the end node
        }
        else if(isBombNode){
            // we know it is the bomb node
        }
        else if (isWeightNode) {
            // it is a weight node
        }
        else if(isWallNode) {
            // it is a wall node
        }
        else {
            // it is unselected as yet
            if(activeFilesIo === 'io-1')
                changeStartNodeId(id);
            else if (activeFilesIo === 'io-2')
                changeEndNodeId(id);
            else if (activeFilesIo === 'io-3')
                changeBombNodeId(id);
            else if (activeFilesIo === 'io-4')
                toggleIsWeightNode(true);
            else if (activeFilesIo === 'io-5')
                toggleIsWallNode(true)

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
            <HexIcon style = {{fill: isWallNode ? "#313244" : ""}}/>
            <div className={classes}/>
        </div>
    );
}

export default React.memo(Hex);
