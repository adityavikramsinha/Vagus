import React from 'react';
import Navbar from './Navbar';
import { StoreProvider } from '../../providers/StoreProvider';
import { treeStore } from '../../stores/TreeStore';
import BlackBoard from './black-board/BlackBoard';

export const TreeVisualiserApp: React.FC = () => {
    return (
        <React.Fragment>
            <StoreProvider useStore={treeStore}>
                <div className="w-full h-screen flex bg-black">
                    <Navbar />
                    <BlackBoard />
                </div>
            </StoreProvider>
        </React.Fragment>
    );
};
export default TreeVisualiserApp;
