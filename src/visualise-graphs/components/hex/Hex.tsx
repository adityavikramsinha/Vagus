import * as React from "react";

import { updateHexIcon } from "../../ts/HexBoardUpdate";
import HexIcon from "./HexIcon";

type HexProps = {
    x: number,
    y: number,
    id: string,
}

/**
 * Returns a Hex Component that is ready to be rendered
 * @returns JSX.Element which has the rendered Hex along with its id
 */
const Hex : React.FC<HexProps> = ({x , y , id}) => {
    const styles : React.CSSProperties = {
        left : `${x}px`,
        top : `${y}px`
    }

    const parsedId = parseInt(id, 10);
    return (
        <div className="hexagon" id={id} style={styles} onClick={() => {
            updateHexIcon(`props-${id}`, parsedId);
        }}>
            <HexIcon idSVG={`svg-${id}`}/>
            <div className="prop-holder no-node" id={`props-${id}`}></div>
        </div>
    );
}

export default Hex;
