import React from "react";
import Button from "@graph/components/action-buttons/Button";
import Syncer from "@graph/api/Syncer";
import useGraphStore from "../../../stores/GraphStore";
import cn from "../../css/cn";

const PrevButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M5.66683 2.8335L2.8335 5.66683L5.66683 8.50016" stroke="#FE640B" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M2.8335 5.66699H10.271C12.4226 5.66699 14.1668 7.41119 14.1668 9.56283C14.1668 11.7145 12.4226 13.4587 10.271 13.4587H3.54183"
                stroke="#FE640B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

const PrevButton = () => {
    return (
        <Button disabled={useGraphStore(state => state.block)} id="prev-button"
                onClick={Syncer.cleanHexBoard}>
            <PrevButtonIcon/>
        </Button>

    )
}

export default PrevButton
