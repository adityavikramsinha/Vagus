import * as React from "react";
import '../css/hex.css';
import HexBoardInitializer from "./HexBoardInitializer";
export default class HexBoard extends React.Component {

  render() {
    return (
      <div className="hex-board" id="hex-board">
        {HexBoardInitializer.renderHex()}
      </div>
    );
  }
}
