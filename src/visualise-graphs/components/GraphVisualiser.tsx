import React from "react";
import HexBoard from "@graph/components/hex-board/HexBoard";
import Navbar from "@graph/components/Navbar"
import {StoreProvider} from "../../providers/StoreProvider";
import {graphStore} from "../api/FrontendStateManager";

export const GraphVisualiser: React.FC = () => {
    return (
        <React.Fragment>
            <StoreProvider useStore={graphStore}>
                <div className="App">
                    <div className="content">
                        <div className="left-cmd" id="left-cmd">
                            <Navbar/>
                        </div>
                        <HexBoard/>
                    </div>
                </div>
            </StoreProvider>
        </React.Fragment>
    );
}
export default GraphVisualiser;
