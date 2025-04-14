import React from "react";
import Button from "./Button";
import useStateManager from "../../store/FrontendStateManager";

const StopButtonIcon= (props: React.SVGProps<SVGSVGElement>)=> {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M8.88891 5.86843L12.2624 2.49497L14.505 4.73761L11.1316 8.11106C10.9168 8.32585 10.9168 8.67409 11.1315 8.88888L14.505 12.2624L12.2624 14.505L8.88891 11.1315C8.67412 10.9168 8.32588 10.9168 8.11109 11.1315L4.73762 14.505L2.49498 12.2624L5.86845 8.88891C6.08324 8.67412 6.08324 8.32588 5.86845 8.11109L2.49498 4.73764L4.73764 2.49497L8.11109 5.86843C8.32588 6.08321 8.67412 6.08321 8.88891 5.86843Z" stroke="#FF0000" strokeWidth="1.5" fill="#FF0000" fillOpacity="0.3"/>
        </svg>
    )
}



type StopButtonProps = {
    onClick: () => void ;
}

const StopButton =(props:StopButtonProps) => {
    return (
        <Button disabled={useStateManager(state =>state.block)} className = "button" id ="stop-button" onClick={props.onClick}>
            <StopButtonIcon/>
        </Button>
    )
}


export default StopButton
