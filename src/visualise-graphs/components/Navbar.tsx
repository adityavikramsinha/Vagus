import * as React from "react";
import {FC} from "react";

import File, {FileType} from "../../components/file/File";
import PrevButton from "@graph/components/action-buttons/PrevButton";
import StopButton from "@graph/components/action-buttons/StopButton";
import StartButton from "@graph/components/action-buttons/StartButton";
import Folder from "../../components/folder/Folder";

import {
    BatFileIcon,
    BombNodeIcon,
    EndNodeIcon,
    IOFileIcon,
    ShortestPathNodeIcon,
    StartNodeIcon,
    TsFileIcon,
    UnvisitedNodeIcon,
    VisitedNodeIcon,
    WallNodeIcon,
    WeightNodeIcon
} from "../../components/file/FileIcons";
import Syncer from "@graph/api/Syncer";
import handleBatFileClick from "../../components/file/handleBatFileClick";
import {MazeType} from "../ts/Types";

const Navbar: FC = () => {
    return (
        <div className="bg-cmd-bg w-full h-full text-white select-none">
            <div className="h-1/10 font-medium flex items-center justify-between pr-4 pl-4">
                <div className="text-2xl">Vagus</div>
                <div className="flex flex-nowrap gap-2.5">
                    <PrevButton/>
                    <StopButton onClick={Syncer.clearHexBoard}/>
                    <StartButton/>
                </div>
            </div>
            <div className="
                            pt-[5px]
                            h-[86%]
                            overflow-y-auto
                            [scrollbar-color:var(--color-moz-sb-color)_transparent]
                            [&::-webkit-scrollbar]:w-[5px]
                            [&::-webkit-scrollbar-thumb]:bg-[var(--color-sb-color)]
                            [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-sb-color-hover)]
                            [&::-webkit-scrollbar-track]:bg-[var(--color-sb-color-track)]
                            ">
                <Folder name="graphs">
                    <Folder name="algorithms">
                        <Folder name="heuristic">
                            <File
                                name="aStarSearch.ts"
                                id="ts-1"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="bestFirstSearch.ts"
                                id="ts-2"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                        </Folder>
                        <Folder name="un-weighted">
                            <File
                                name="breadthFirstSearch.ts"
                                id="ts-3"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="depthFirstSearch.ts"
                                id="ts-4"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="randomWalk.ts"
                                id="ts-5"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="bestFirstSearch.ts"
                                id="ts-6"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                        </Folder>
                        <Folder name="weighted">
                            <File
                                name="aStarSearch.ts"
                                id="ts-7"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="dijkstrasSearch.ts"
                                id="ts-8"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="bellmanFord.ts"
                                id="ts-9"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                            <File
                                name="biDirectionalSearch.ts"
                                id="ts-10"
                                type={FileType.TS}
                                Icon={<TsFileIcon/>}
                            />
                        </Folder>
                    </Folder>
                    <Folder name="addableNodes">
                        <File
                            name="startNode.io"
                            id="io-1"
                            type={FileType.IO}
                            Icon={<IOFileIcon/>}
                        />
                        <File
                            name="endNode.io"
                            id="io-2"
                            type={FileType.IO}
                            Icon={<IOFileIcon/>}
                        />
                        <File
                            name="bombNode.io"
                            id="io-3"
                            type={FileType.IO}
                            Icon={<IOFileIcon/>}
                        />
                        <File
                            name="weightNode.io"
                            id="io-4"
                            type={FileType.IO}
                            Icon={<IOFileIcon/>}
                        />
                        <File
                            name="wallNode.io"
                            id="io-5"
                            type={FileType.IO}
                            Icon={<IOFileIcon/>}
                        />
                    </Folder>
                    <Folder name="mazes">
                        <File
                            name="generateRandomMaze.bat"
                            id="bat-1"
                            type={FileType.BAT}
                            Icon={<BatFileIcon/>}
                            onClick={() => handleBatFileClick(MazeType.GENERATE_RANDOM_MAZE)}
                        />
                        <Folder name="wall">
                            <File
                                name="generateBlockedRidges.bat"
                                id="bat-3"
                                type={FileType.BAT}
                                Icon={<BatFileIcon/>}
                                onClick={() => handleBatFileClick(MazeType.GENERATE_BLOCKED_RIDGES)}
                            />
                            <File
                                name="generateBlockedRandomMaze.bat"
                                id="bat-4"
                                type={FileType.BAT}
                                Icon={<BatFileIcon/>}
                                onClick={() => handleBatFileClick(MazeType.GENERATE_BLOCKED_RANDOM_MAZE)}
                            />
                        </Folder>
                        <Folder name="weighted">
                            <File
                                name="generateWeightedRidges.bat"
                                id="bat-5"
                                type={FileType.BAT}
                                Icon={<BatFileIcon/>}
                                onClick={() => handleBatFileClick(MazeType.GENERATE_WEIGHTED_RIDGES)}
                            />
                            <File
                                name="generateWeightedRandomMaze.bat"
                                id="bat-6"
                                type={FileType.BAT}
                                Icon={<BatFileIcon/>}
                                onClick={() => handleBatFileClick(MazeType.GENERATE_WEIGHTED_RANDOM_MAZE)}

                            />
                        </Folder>
                    </Folder>
                    <Folder name="legend">
                        <File
                            name="bombNode.gui"
                            id="gui-1"
                            Icon={<BombNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="shortestPathNode.gui"
                            id="gui-2"
                            Icon={<ShortestPathNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="wallNode.gui"
                            id="gui-3"
                            Icon={<WallNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="visitedNode.gui"
                            id="gui-4"
                            Icon={<VisitedNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="unvisitedNode.gui"
                            id="gui-5"
                            Icon={<UnvisitedNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="startNode.gui"
                            id="gui-6"
                            Icon={<StartNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="endNode.gui"
                            id="gui-7"
                            Icon={<EndNodeIcon/>}
                            type={FileType.GUI}
                        />
                        <File
                            name="weightNode.gui"
                            id="gui-8"
                            Icon={<WeightNodeIcon/>}
                            type={FileType.GUI}
                        />
                    </Folder>
                </Folder>
            </div>
        </div>
    );
};
export default Navbar;
