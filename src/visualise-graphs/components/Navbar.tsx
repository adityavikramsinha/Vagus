import * as React from "react";
import {FC} from "react";

import File, {FileType} from "./file/File";
import PrevButton from "./action-buttons/PrevButton";
import StopButton from "./action-buttons/StopButton";
import StartButton from "./action-buttons/StartButton";
import Folder from "./folder/Folder";

import {
    BatFileIcon,
    BombNodeIcon,
    EndNodeIcon,
    IOFileIcon,
    MdFileIcon,
    ShortestPathNodeIcon,
    StartNodeIcon,
    SysFileIcon,
    TsFileIcon,
    UnvisitedNodeIcon,
    VisitedNodeIcon,
    WallNodeIcon,
    WeightNodeIcon
} from "./file/FileIcons";
import useStateManager, {NodeAction, NodeType} from "../store/FrontendStateManager";
import {NOTSET} from "../ts/Types";

const Navbar: FC = () => {
    const changeNode = useStateManager(state=>state.changeNode);
    const clearHexBoard = useStateManager(state=>state.clearHexBoard);
    const handleStopButtonClick =()=>{
        changeNode(NodeType.END_NODE, NodeAction.SET, NOTSET);
        changeNode(NodeType.START_NODE, NodeAction.SET, NOTSET);
        changeNode(NodeType.BOMB_NODE, NodeAction.SET, NOTSET);
        clearHexBoard();
    }
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
                                        name="aStarSearch.ts"
                                        id="ts-1"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="bestFirstSearch.ts"
                                        id="ts-2"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                </Folder>
                                <Folder text="un-weighted" divClassName="folder advanced-cp-comp" arrowID="un-weighted-arrow">
                                    <File
                                        name="breadthFirstSearch.ts"
                                        id="tsx-3"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="depthFirstSearch.ts"
                                        id="tsx-4"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="randomWalk.ts"
                                        id="tsx-5"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="bestFirstSearch.ts"
                                        id="tsx-6"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                </Folder>
                                <Folder text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow">
                                    <File
                                        name="aStarSearch.ts"
                                        id="tsx-7"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="dijkstrasSearch.ts"
                                        id="tsx-8"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="bellmanFord.ts"
                                        id="tsx-9"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                    <File
                                        name="biDirectionalSearch.ts"
                                        id="tsx-10"
                                        type={FileType.TS}
                                        Icon={<TsFileIcon />}
                                    />
                                </Folder>
                            </div>
                        </Folder>
                        <Folder text="addableNodes" divClassName="folder advanced-cp-comp" arrowID="addable-arrow">
                            <File
                                name="startNode.io"
                                id="io-1"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                name="endNode.io"
                                id="io-2"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                name="bombNode.io"
                                id="io-3"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                name="weightNode.io"
                                id="io-4"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                            <File
                                name="wallNode.io"
                                id="io-5"
                                type={FileType.IO}
                                Icon={<IOFileIcon />}
                            />
                        </Folder>
                        <Folder text="mazes" divClassName="folder advanced-cp-comp" arrowID="mazes-arrow">
                            <File
                                name="generateRandomMaze.bat"
                                id="bat-1"
                                type={FileType.BAT}
                                Icon={<BatFileIcon />}
                            />
                            <Folder text="wall" divClassName="folder advanced-cp-comp" arrowID="wall-arrow">
                                <File
                                    name="generateLeastCostPathBlocker.bat"
                                    id="bat-2"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                                <File
                                    name="generateBlockedRidges.bat"
                                    id="bat-3"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                                <File
                                    name="generateBlockedRandomMaze.bat"
                                    id="bat-4"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                            </Folder>
                            <Folder text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow">
                                <File
                                    name="generateWeightedRidges.bat"
                                    id="bat-5"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                                <File
                                    name="generateWeightedRandomMaze.bat"
                                    id="bat-6"
                                    type={FileType.BAT}
                                    Icon={<BatFileIcon />}
                                />
                            </Folder>
                        </Folder>
                        <Folder text="speeds" divClassName="folder advanced-cp-comp" arrowID="speeds-arrow">
                            <File
                                name="25percent.sys"
                                id="sys-1"
                                type={FileType.SYS}
                                Icon={<SysFileIcon />}
                            />
                            <File
                                name="50percent.sys"
                                id="sys-2"
                                type={FileType.SYS}
                                Icon={<SysFileIcon />}
                            />
                            <File
                                name="100percent.sys"
                                id="sys-3"
                                type={FileType.SYS}
                                Icon={<SysFileIcon />}
                            />
                        </Folder>
                        <Folder text="legend" divClassName="folder advanced-cp-comp" arrowID="legend-arrow">
                            <File
                                name="bombNode.gui"
                                id="gui-1"
                                Icon={<BombNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="shortestPathNode.gui"
                                id="gui-2"
                                Icon={<ShortestPathNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="wallNode.gui"
                                id="gui-3"
                                Icon={<WallNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="visitedNode.gui"
                                id="gui-4"
                                Icon={<VisitedNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="unvisitedNode.gui"
                                id="gui-5"
                                Icon={<UnvisitedNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="startNode.gui"
                                id="gui-6"
                                Icon={<StartNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="endNode.gui"
                                id="gui-7"
                                Icon={<EndNodeIcon />}
                                type={FileType.GUI}
                            />
                            <File
                                name="weightNode.gui"
                                id="gui-8"
                                Icon={<WeightNodeIcon />}
                                type={FileType.GUI}
                            />
                        </Folder>
                        <File
                            name="settings.json"
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
