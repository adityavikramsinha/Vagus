import * as React from "react";

import HexBoardInitializer from "./HexBoardInitializer";
export default class HexBoard extends React.Component {

  render() {
    return (
      <div className="hex-board" id="hex-board">
        <HexBoardInitializer/>
      </div>
    );
  }
}
