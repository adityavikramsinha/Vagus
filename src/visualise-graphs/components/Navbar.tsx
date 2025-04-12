import * as React from "react";

import File, {FileType} from "./file/File";
import PrevButton from "./action-buttons/PrevButton";
import StopButton from "./action-buttons/StopButton";
import StartButton from "./action-buttons/StartButton";
import Folder from "./folder/Folder";

import {
    BatFileIcon,
    BombNodeIcon, EndNodeIcon,
    IOFileIcon,
    MdFileIcon,
    ShortestPathNodeIcon, StartNodeIcon,
    SysFileIcon,
    TsFileIcon, UnvisitedNodeIcon, VisitedNodeIcon,
    WallNodeIcon, WeightNodeIcon
} from "./file/FileIcons";
import { FC} from "react";
import currentState from "../ts/GlobalState";
import {removeAllClasses, updateIDClass} from "../ts/Utility";
import Graph from "../ts/Graph";

const Navbar: FC = () => {
    const handleStopButtonClick =()=>{
        console.log("stop button clicked");
        if (currentState.run() === true) currentState.changeRun();
        updateIDClass('stop-button', [], ['button-clicked'])
        removeAllClasses(500, ['start-node', 'end-node', 'wall-node', 'weight-node', 'bomb-node']);
        currentState.changeBombNode(null);
        currentState.changeEndNode(null);
        currentState.changeStartNode(null);
        Graph.copy(currentState.initGraph(), currentState.graph(), 1);
        updateIDClass('stop-button', ['button-clicked'], [])
    }
    // console.log(activeFiles)
    return (
        <div className="navbar">
            <div className="header">
                <div className="title">Vagus</div>
                <div className="buttons">
                    <PrevButton />
                    <StopButton onClick={()=>handleStopButtonClick()}/>
                    <StartButton />
                </div>
            </div>
            <div className="folder-panel">
                <Folder text="graphs" divClassName="folder" arrowID="vagus-master-arrow">
                    <div className="advanced-cp-border">
                        <Folder text="algorithms" divClassName="folder advanced-cp-comp" arrowID="algorithms-arrow">
                            <div className="folder-drop-inner">
                                <Folder text="heuristic" divClassName="folder advanced-cp-comp" arrowID="heuristic-arrow">
                                    <File
                                        text="aStarSearch.ts"
                                        id="ts-1"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="bestFirstSearch.ts"
                                        id="ts-2"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                </Folder>
                                <Folder text="un-weighted" divClassName="folder advanced-cp-comp" arrowID="un-weighted-arrow">
                                    <File
                                        text="breadthFirstSearch.ts"
                                        id="tsx-3"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="depthFirstSearch.ts"
                                        id="tsx-4"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="randomWalk.ts"
                                        id="tsx-5"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="bestFirstSearch.ts"
                                        id="tsx-6"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                </Folder>
                                <Folder text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow">
                                    <File
                                        text="aStarSearch.ts"
                                        id="tsx-7"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="dijkstrasSearch.ts"
                                        id="tsx-8"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="bellmanFord.ts"
                                        id="tsx-9"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        text="biDirectionalSearch.ts"
                                        id="tsx-10"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                </Folder>
                            </div>
                        </Folder>
                        <Folder text="addableNodes" divClassName="folder advanced-cp-comp" arrowID="addable-arrow">
                            <File
                                text="startNode.io"
                                id="io-1"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                text="endNode.io"
                                id="io-2"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                text="bombNode.io"
                                id="io-3"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                text="weightNode.io"
                                id="io-4"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                text="wallNode.io"
                                id="io-5"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                        </Folder>
                        <Folder text="mazes" divClassName="folder advanced-cp-comp" arrowID="mazes-arrow">
                            <File
                                text="none.bat"
                                id="bat-1"
                                type={FileType.BAT}
                                Icon={<BatFileIcon />}
                            />
                            <File
                                text="generateRandomMaze.bat"
                                id="bat-2"
                                type={FileType.BAT}
                                Icon={<BatFileIcon />}
                            />
                            <Folder text="wall" divClassName="folder advanced-cp-comp" arrowID="wall-arrow">
                                <File
                                    text="generateLeastCostPathBlocker.bat"
                                    id="bat-3"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                                <File
                                    text="generateBlockedRidges.bat"
                                    id="bat-4"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                                <File
                                    text="generateBlockedRandomMaze.bat"
                                    id="bat-5"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                            </Folder>
                            <Folder text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow">
                                <File
                                    text="generateWeightedRidges.bat"
                                    id="bat-6"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                                <File
                                    text="generateWeightedRandomMaze.bat"
                                    id="bat-7"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                            </Folder>
                        </Folder>
                        <Folder text="speeds" divClassName="folder advanced-cp-comp" arrowID="speeds-arrow">
                            <File
                                text="25percent.sys"
                                id="sys-1"
                                type={FileType.SYS}
                                Icon={<SysFileIcon />}
                            />
                            <File
                                text="50percent.sys"
                                id="sys-2"
                                type={FileType.SYS}
                                Icon={<SysFileIcon />}
                            />
                            <File
                                text="100percent.sys"
                                id="sys-3"
                                type={FileType.SYS}
                                Icon={<SysFileIcon />}
                            />
                        </Folder>
                        <Folder text="legend" divClassName="folder advanced-cp-comp" arrowID="legend-arrow">
                            <File
                                text="bombNode.gui"
                                id="gui-1"
                                Icon={<BombNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="shortestPathNode.gui"
                                id="gui-2"
                                Icon={<ShortestPathNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="wallNode.gui"
                                id="gui-3"
                                Icon={<WallNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="visitedNode.gui"
                                id="gui-4"
                                Icon={<VisitedNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="unvisitedNode.gui"
                                id="gui-5"
                                Icon={<UnvisitedNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="startNode.gui"
                                id="gui-6"
                                Icon={<StartNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="endNode.gui"
                                id="gui-7"
                                Icon={<EndNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                text="weightNode.gui"
                                id="gui-8"
                                Icon={<WeightNodeIcon />}
                                type={FileType.GUI}
                            />
                        </Folder>
                        <File
                            text="settings.json"
                            id="md-1"
                            type={FileType.MD}
                            Icon={<MdFileIcon />}
                        />
                    </div>
                </Folder>
            </div>
        </div>
    );
};
export default Navbar;
