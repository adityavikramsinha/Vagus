import * as React from "react";
import {FC} from "react";


import {IOFileIcon, TsFileIcon} from "../../components/file/FileIcons";
import Folder from "../../components/folder/Folder";
import File, {FileType} from "../../components/file/File";

const Navbar: FC = () => {
    return (
        <div className="w-[30vw] border-r border-r-cmd-border bg-cmd-bg h-full text-white select-none">
            <div className="h-1/10 font-medium flex items-center justify-between pr-4 pl-4">
                <div className="text-2xl">Vagus</div>
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
                    <Folder name="addableNodes">
                        <File type={FileType.IO} id={'io-1'} name="nodeActions.io" Icon={<IOFileIcon/>}/>
                        <File type={FileType.IO} id={'io-2'} name={"addEdge.io"} Icon={<IOFileIcon/>}/>
                    </Folder>
                </Folder>
            </div>
        </div>
    );
};
export default Navbar;
