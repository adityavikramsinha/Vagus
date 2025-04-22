import React from "react";
import HexBoard from "@graph/components/hex-board/HexBoard";
import Navbar from "./Navbar"
import {StoreProvider} from "../../providers/StoreProvider";
import {treeStore} from "../../stores/TreeStore";


export const TreeVisualiserApp: React.FC = () => {
    return (
        <React.Fragment>
            <StoreProvider useStore={treeStore}>
                <div className="App">
                    <div className="content">
                        <div className="left-cmd" id="left-cmd">
                            <Navbar/>
                        </div>
                    </div>
                </div>
            </StoreProvider>
        </React.Fragment>
    );
}
export default TreeVisualiserApp;
