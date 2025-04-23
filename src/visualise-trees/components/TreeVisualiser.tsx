import React from "react";
import Navbar from "./Navbar"
import {StoreProvider} from "../../providers/StoreProvider";
import {treeStore} from "../../stores/TreeStore";


export const TreeVisualiserApp: React.FC = () => {
    return (
        <React.Fragment>
            <StoreProvider useStore={treeStore}>
                <div className="w-full h-screen flex bg-black">
                    <Navbar/>
                </div>
            </StoreProvider>
        </React.Fragment>
    );
}
export default TreeVisualiserApp;
