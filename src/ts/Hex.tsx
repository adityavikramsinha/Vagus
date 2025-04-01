import * as React from "react";
import '../css/hex.css';
import { HexIcon } from "../svgIcons/hexagonSVGIconComponent";
import { updateHexIcon } from "./HexBoardUpdate";

type props = {
  x: number,
  y: number,
  id: string,
}

export default class Hex extends React.Component<props> {
  styles = {
    hexagon: {
      left: this.props.x + "px",
      top: this.props.y + "px",
    } as React.CSSProperties
  }

  /**
   * Renders each individual hexagon.
   * @return void
   */
    render() {
    return (
      <div className="hexagon" id={this.props.id} style={this.styles.hexagon} onClick={() => {
        updateHexIcon(`props-${this.props.id}`, parseInt(this.props.id));
      }}>
        <HexIcon idSVG={`svg-${this.props.id}`}/>
        <div className="prop-holder no-node" id={`props-${this.props.id}`}></div>
      </div>
    );
  }
}
