import React from "react";
import currentState from "../../ts/GlobalState";
import {unUpdateNodes} from "../../ts/HexBoardAlgoRunUpdate";
import Button from "./Button";

const PrevButtonIcon= (props: React.SVGProps<SVGSVGElement>)=> {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" >
            <path d="M4.80859 11.1969C4.80859 11.1969 8.54798 14.7053 11.4784 11.9364C13.182 10.3268 13.2248 6.96281 11.4784 5.41602C8.85645 3.09371 4.80859 6.74129 4.80859 6.74129" stroke="#FE640B" strokeWidth="2.5"/>
            <path d="M3.21695 8.12877L3.89018 5.1894C3.98172 4.78973 4.40875 4.65587 4.65885 4.94845L6.49814 7.10021C6.74823 7.39279 6.6338 7.89238 6.29217 7.99947L3.77966 8.78707C3.43803 8.89417 3.12541 8.52844 3.21695 8.12877Z" fill="#FE640B" stroke="#FE640B"/>
        </svg>
    )
}

const prevButtonClick = (): void => {
    if (currentState.run() === true) currentState.changeRun();
    unUpdateNodes('path-node', 'un-path-node');
    unUpdateNodes('visited-node', 'un-visited-node');
    unUpdateNodes('visited-node-bomb', 'un-visited-bomb-node');
}

const PrevButton = () =>  {
    return(
        <Button id = "prev-button" className = "button" onClick={prevButtonClick}>
            <PrevButtonIcon/>
        </Button>

    )
}

export default PrevButton
