import React from "react";
import HexBoard from "@graph/components/hex-board/HexBoard";
import Navbar from "@graph/components/Navbar"

export const GraphVisualiser :React.FC = () => {
    return (
        <React.Fragment>
            <div className="App">
                <div className="content">
                    <div className="left-cmd" id="left-cmd">
                        <Navbar />
                    </div>
                    <HexBoard />
                </div>
            </div>
        </React.Fragment >
    );
}
export default GraphVisualiser;
