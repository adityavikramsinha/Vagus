import * as React from "react";

import File, { FileType } from "./file/File";
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

const Navbar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="header">
                <div className="title">Vagus</div>
                <div className="buttons">
                    <PrevButton />
                    <StopButton />
                    <StartButton />
                </div>
            </div>
            <div className="folder-panel">
                <Folder text="graphs" divClassName="folder" arrowID="vagus-master-arrow">
                    <div className="advanced-cp-border">
                        <Folder text="algorithms" divClassName="folder advanced-cp-comp" arrowID="algorithms-arrow">
                            <div className="folder-drop-inner">
                                <Folder text="heuristic" divClassName="folder advanced-cp-comp" arrowID="heuristic-arrow">
                                    <File pClassName="tsx-name file-name" text="aStarSearch.ts" divId="tsx-1" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="bestFirstSearch.ts" divId="tsx-2" type={FileType.TS} Icon={<TsFileIcon />} />
                                </Folder>
                                <Folder text="un-weighted" divClassName="folder advanced-cp-comp" arrowID="un-weighted-arrow">
                                    <File pClassName="tsx-name file-name" text="breadthFirstSearch.ts" divId="tsx-3" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="depthFirstSearch.ts" divId="tsx-4" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="randomWalk.ts" divId="tsx-5" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="bestFirstSearch.ts" divId="tsx-6" type={FileType.TS} Icon={<TsFileIcon />} />
                                </Folder>
                                <Folder text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow">
                                    <File pClassName="tsx-name file-name" text="aStarSearch.ts" divId="tsx-7" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="dijkstrasSearch.ts" divId="tsx-8" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="bellmanFord.ts" divId="tsx-9" type={FileType.TS} Icon={<TsFileIcon />} />
                                    <File pClassName="tsx-name file-name" text="biDirectionalSearch.ts" divId="tsx-10" type={FileType.TS} Icon={<TsFileIcon />} />
                                </Folder>
                            </div>
                        </Folder>
                        <Folder text="addableNodes" divClassName="folder advanced-cp-comp" arrowID="addable-arrow">
                            <File pClassName="node-name file-name" text="startNode.io" divId="io-1" type={FileType.IO} Icon={<IOFileIcon />} />
                            <File pClassName="node-name file-name" text="endNode.io" divId="io-2" type={FileType.IO} Icon={<IOFileIcon />} />
                            <File pClassName="node-name file-name" text="bombNode.io" divId="io-3" type={FileType.IO} Icon={<IOFileIcon />} />
                            <File pClassName="node-name file-name" text="weightNode.io" divId="io-4" type={FileType.IO} Icon={<IOFileIcon />} />
                            <File pClassName="node-name file-name" text="wallNode.io" divId="io-5" type={FileType.IO} Icon={<IOFileIcon />} />
                        </Folder>
                        <Folder text="mazes" divClassName="folder advanced-cp-comp" arrowID="mazes-arrow">
                            <File pClassName="maze-name file-name" text="none.bat" divId="bat-1" type={FileType.BAT} Icon={<BatFileIcon />} />
                            <File pClassName="maze-name file-name" text="generateRandomMaze.bat" divId="bat-2" type={FileType.BAT} Icon={<BatFileIcon />} />
                            <Folder text="wall" divClassName="folder advanced-cp-comp" arrowID="wall-arrow">
                                <File pClassName="maze-name file-name" text="generateLeastCostPathBlocker.bat" divId="bat-3" type={FileType.BAT} Icon={<BatFileIcon />} />
                                <File pClassName="maze-name file-name" text="generateBlockedRidges.bat" divId="bat-4" type={FileType.BAT} Icon={<BatFileIcon />} />
                                <File pClassName="maze-name file-name" text="generateBlockedRandomMaze.bat" divId="bat-5" type={FileType.BAT} Icon={<BatFileIcon />} />
                            </Folder>
                            <Folder text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow">
                                <File pClassName="maze-name file-name" text="generateWeightedRidges.bat" divId="bat-6" type={FileType.BAT} Icon={<BatFileIcon />} />
                                <File pClassName="maze-name file-name" text="generateWeightedRandomMaze.bat" divId="bat-7" type={FileType.BAT} Icon={<BatFileIcon />} />
                            </Folder>
                        </Folder>
                        <Folder text="speeds" divClassName="folder advanced-cp-comp" arrowID="speeds-arrow">
                            <File pClassName="speed-name file-name" text="25percent.sys" divId="sys-1" type={FileType.SYS} Icon={<SysFileIcon />} />
                            <File pClassName="speed-name file-name" text="50percent.sys" divId="sys-2" type={FileType.SYS} Icon={<SysFileIcon />} />
                            <File pClassName="speed-name file-name" text="100percent.sys" divId="sys-3" type={FileType.SYS} Icon={<SysFileIcon />} />
                        </Folder>
                        <Folder text="legend" divClassName="folder advanced-cp-comp" arrowID="legend-arrow">
                            <File  pClassName="legend-name file-name" text="bombNode.gui" guiType="bomb" divId="gui-1" Icon={<BombNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="shortestPathNode.gui" guiType="shortest-path" divId="gui-2" Icon={<ShortestPathNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="wallNode.gui" guiType="wall" divId="gui-3" Icon={<WallNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="visitedNode.gui" guiType="visited" divId="gui-4" Icon={<VisitedNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="unvisitedNode.gui" guiType="unvisited" divId="gui-5" Icon={<UnvisitedNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="startNode.gui" guiType="start-node" divId="gui-6" Icon={<StartNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="endNode.gui" guiType="end-node" divId="gui-7" Icon={<EndNodeIcon/>}/>
                            <File  pClassName="legend-name file-name" text="weightNode.gui" guiType="weight" divId="gui-8" Icon={<WeightNodeIcon/>}/>
                        </Folder>
                        <File pClassName="file-name" text="settings.json" divId="md-1" type={FileType.MD} Icon={<MdFileIcon />} />
                    </div>
                </Folder>
            </div>
        </div>
    );
};
export default Navbar;
