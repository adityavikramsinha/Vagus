import * as React from "react";
import {FC} from "react";


import {IOFileIcon, TsFileIcon} from "@/components/file/FileIcons";
import Folder from "@/components/folder/Folder";
import File, {FileType} from "@/components/file/File";
import StartButton from "./action-buttons/StartButton";
import useTreeStore from "@/stores/TreeStore";
import {NOTSET} from "@graph/ts/Types";
import StopButton from "./action-buttons/StopButton";

const Navbar: FC = () => {
    return (
        <div
            className="w-[30vw] border-r border-r-cmd-border bg-cmd-bg h-full text-white select-none">
            <div className="h-1/10 font-medium flex items-center justify-between pr-4 pl-4">
                <div className="text-2xl">Vagus</div>
                <div className="flex flex-nowrap gap-2.5">
                    <StopButton onClick={() => {
                        useTreeStore.setState(
                            {
                                executing: false, block: false, visitedVertices: new Set(),
                                visitedEdges: new Map()
                            })
                    }}/>
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
                    <Folder name="actions">
                        <File type={FileType.IO} id='io-1' name="vertices.io" Icon={<IOFileIcon/>}/>
                        <File type={FileType.IO} id='io-2' name="edges.io" Icon={<IOFileIcon/>}
                              onClick={() => useTreeStore.setState({srcNodeId: NOTSET})}/>
                        <File type={FileType.IO} id='io-3' name="assignStartVertex.io"
                              Icon={<IOFileIcon/>}/>
                        <File type={FileType.IO} id='io-4' name="assignEndVertex.io"
                              Icon={<IOFileIcon/>}/>
                    </Folder>
                    <Folder name="algorithms">
                        <Folder name="traversal">
                            <File type={FileType.TS} id="ts-1" name="bfs.ts" Icon={<TsFileIcon/>}/>
                        </Folder>
                        <File type={FileType.TS} id="ts-2" name="dijkstras.ts"
                              Icon={<TsFileIcon/>}/>
                    </Folder>
                </Folder>
            </div>
        </div>
    );
};
export default Navbar;
