import React from "react";
import currentState from "../../ts/GlobalState";
import {updateIDClass} from "../../ts/Utility";
import {removeAllClasses} from "../../ts/Utility";
import Graph from "../../ts/Graph";

const StopButtonIcon= (props: React.SVGProps<SVGSVGElement>)=> {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" {...props} id="stop-button" className = "button">
            <path d="M12.8086 4.19141L4.19087 12.8091" stroke="#FF0000" stroke-width="3" stroke-linecap="round"/>
            <path d="M4.19141 4.19141L12.8091 12.8091" stroke="#FF0000" stroke-width="3" stroke-linecap="round"/>
        </svg>
    )
}


/**
 * Resets the hex board to its default initial state when the Stop button is clicked.
 * Requires no parameters.
 * @return void
 */
const stopButtonClick = (): void => {
    if (currentState.run() === true) currentState.changeRun();
    updateIDClass('stop-button', [], ['button-clicked'])
    removeAllClasses(500, ['start-node', 'end-node', 'wall-node', 'weight-node', 'bomb-node']);
    currentState.changeBombNode(null);
    currentState.changeEndNode(null);
    currentState.changeStartNode(null);
    Graph.copy(currentState.initGraph(), currentState.graph(), 1);
    setTimeout(() => {
        updateIDClass('stop-button', ['button-clicked'], [])
    }, 510);
}


const StopButton =() => {
    return <StopButtonIcon onClick={stopButtonClick}/>
}


export default StopButton
