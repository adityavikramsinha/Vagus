import * as React from "react";
import { ProjectIcon } from './projectSVGIconComponent';
import * as ActionIcons from './actionButtons';
import { FolderComponent } from "./folderStruct";
import { TsFile, IOFile, BATFile, SYSFile, MDFile, GUIFile } from "./fileStruct";
import { StopButtonClick, StartButtonClick, PrevButtonClick } from "../ts/ActionButtonsFunctionality";
import currentState from '../ts/GlobalState';
import { RemoveAllClasses } from '../ts/ActionButtonsFunctionality';
import Node from "../ts/Node";

const Navbar : React.FC = () =>{
    function getColor(identifier : string): string{
        return `#${currentState.cssVariables().get(identifier)}`
    }
    return (
        <div className="navbar">
            <div className="header">
                <div className="title">Vagus</div>
                <div className="buttons">
                    <ActionIcons.PrevButtonIcon onClick={() => {
                        PrevButtonClick();
                    }} />
                    <ActionIcons.StopButtonIcon onClick={() => {
                        StopButtonClick();
                    }} />
                    <ActionIcons.RunButtonIcon onClick={() => {
                        let currentNode: Node<number> = currentState.graph().nodes().get(currentState.startNode())
                        RemoveAllClasses(1, []);
                        if (currentState.run()) StartButtonClick(currentNode, true);
                        else if (!currentState.run()) {
                            currentState.changeRun();
                            StartButtonClick(currentNode, false)
                        }
                    }} />
                </div>
            </div>
            <div className="folder-panel">
                <FolderComponent text="graphs" divClassName="folder" arrowID="vagus-master-arrow">
                    <div className="advanced-cp-border">

                        <FolderComponent  text="algorithms" divClassName="folder advanced-cp-comp" arrowID="algorithms-arrow" >
                            <div className="folder-drop-inner">
                                <FolderComponent  text="heuristic" divClassName="folder advanced-cp-comp" arrowID="heuristic-arrow">
                                    <div className="folder-drop-inner">
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="aStarSearch.ts" divID="tsx-1" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="bestFirstSearch.ts" divID="tsx-2" />
                                    </div>
                                </FolderComponent>
                                <FolderComponent  text="un-weighted" divClassName="folder advanced-cp-comp" arrowID="un-weighted-arrow">
                                    <div className="folder-drop-inner">
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="breadthFirstSearch.ts" divID="tsx-3" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="depthFirstSearch.ts" divID="tsx-4" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="randomWalk.ts" divID="tsx-5" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="bestFirstSearch.ts" divID="tsx-6" />
                                    </div>
                                </FolderComponent>
                                <FolderComponent  text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow" >
                                    <div className="folder-drop-inner">
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="aStarSearch.ts" divID="tsx-7" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="dijkstrasSearch.ts" divID="tsx-8" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="bellmanFord.ts" divID="tsx-9" />
                                        <TsFile divClassName="file ts-file" pClassName="tsx-name file-name" text="biDirectionalSearch.ts" divID="tsx-10" />
                                    </div>
                                </FolderComponent>
                            </div>
                        </FolderComponent>
                        <FolderComponent  text="addableNodes" divClassName="folder advanced-cp-comp" arrowID="addable-arrow">
                            <div className="folder-drop-inner">
                                <IOFile divClassName="file io-file" pClassName="node-name file-name" text="startNode.io" divID="io-1" />
                                <IOFile divClassName="file io-file" pClassName="node-name file-name" text="endNode.io" divID="io-2" />
                                <IOFile divClassName="file io-file" pClassName="node-name file-name" text="bombNode.io" divID="io-3" />
                                <IOFile divClassName="file io-file" pClassName="node-name file-name" text="weightNode.io" divID="io-4" />
                                <IOFile divClassName="file io-file" pClassName="node-name file-name" text="wallNode.io" divID="io-5" />
                            </div>
                        </FolderComponent>
                        <FolderComponent  text="mazes" divClassName="folder advanced-cp-comp" arrowID="mazes-arrow">
                            <div className="folder-drop-inner">
                                <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="none.bat" divID="bat-1" />
                                <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateRandomMaze.bat" divID="bat-2" />
                                <FolderComponent  text="wall" divClassName="folder advanced-cp-comp" arrowID="wall-arrow">
                                    <div className="folder-drop-inner">
                                        <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateLeastCostPathBlocker.bat" divID="bat-3" />
                                        <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateBlockedRidges.bat" divID="bat-4" />
                                        <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateBlockedRandomMaze.bat" divID="bat-5" />
                                    </div>
                                </FolderComponent>
                                <FolderComponent  text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow" >
                                    <div className="folder-drop-inner">
                                        <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateWeightedRidges.bat" divID="bat-6" />
                                        <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateWeightedRandomMaze.bat" divID="bat-7" />
                                    </div>
                                </FolderComponent>
                            </div>
                        </FolderComponent>
                        <FolderComponent text="speeds" divClassName="folder advanced-cp-comp" arrowID="speeds-arrow">
                            <div className="folder-drop-inner">
                                <SYSFile divClassName="file sys-file" pClassName="speed-name file-name" text="25percent.sys" divID="sys-1" />
                                <SYSFile divClassName="file sys-file" pClassName="speed-name file-name" text="50percent.sys" divID="sys-2" />
                                <SYSFile divClassName="file sys-file" pClassName="speed-name file-name" text="100percent.sys" divID="sys-3" />
                            </div>
                        </FolderComponent>
                        <FolderComponent text="legend" divClassName="folder advanced-cp-comp" arrowID="legend-arrow">
                            <div className="folder-drop-inner">
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="bombNode.gui" type="bomb" divID="gui-1" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="shortestPathNode.gui" type="shortest-path" divID="gui-2" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="wallNode.gui" type="wall" divID="gui-3" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="visitedNode.gui" type="visited" divID="gui-4" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="unvisitedNode.gui" type="unvisited" divID="gui-5" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="startNode.gui" type="start-node" divID="gui-6" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="endNode.gui" type="end-node" divID="gui-7" />
                                <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="weightNode.gui" type="weight" divID="gui-8" />
                            </div>
                        </FolderComponent>
                        <MDFile divClassName="folder-less-file file md-file advanced-cp-comp" pClassName="file-name" text="settings.json" divID="md-1"/>
                    </div>
                </FolderComponent>
            </div>
        </div>
    );
}
export default Navbar;
