import React from "react";
import Button from "./Button";

const StopButtonIcon= (props: React.SVGProps<SVGSVGElement>)=> {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" {...props} id="stop-button" className = "button">
            <path d="M12.8086 4.19141L4.19087 12.8091" stroke="#FF0000" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4.19141 4.19141L12.8091 12.8091" stroke="#FF0000" strokeWidth="3" strokeLinecap="round"/>
        </svg>
    )
}



type StopButtonProps = {
    onClick: () => void ;
}

const StopButton =(props:StopButtonProps) => {
    return (
        <Button className = "button" id ="stop-button" onClick={props.onClick}>
            <StopButtonIcon/>
        </Button>
    )
}


export default StopButton
