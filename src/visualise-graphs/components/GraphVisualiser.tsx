import React from "react";
import HexBoard from "@graph/components/hex-board/HexBoard";
import Navbar from "@graph/components/Navbar"
import {StoreProvider} from "../../providers/StoreProvider";
import {graphStore} from "../../stores/GraphStore";

export const GraphVisualiser: React.FC = () => {
    return (
        <React.Fragment>
            <StoreProvider useStore={graphStore}>
                <div className="w-full h-screen flex bg-black">
                    <Navbar/>
                    <HexBoard/>
                </div>
            </StoreProvider>
        </React.Fragment>
    );
}
export default GraphVisualiser;
