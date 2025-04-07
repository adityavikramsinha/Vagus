import React from "react";
import HexBoard from "./HexBoard";
import Navbar from "./Navbar";
import Settings from "./Settings";

export const GraphVisualiserApp :React.FC = () => {
    return (
        <React.Fragment>
            <div className="App">
                <div className="content">
                    <div className="left-cmd" id="left-cmd">
                        <Navbar />
                    </div>
                    <HexBoard />
                    <Settings />
                </div>
            </div>
        </React.Fragment >
    );
}
export default GraphVisualiserApp;
