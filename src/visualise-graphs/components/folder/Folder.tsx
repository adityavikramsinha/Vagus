import React, {useState} from "react";
import {ArrowIcon, FolderOpenIcon, FolderClosedIcon} from "@graph/components/folder/FolderIcons";

type FolderComponentProps = {
    children: React.ReactNode;
    text: string;
    divClassName: string;
    arrowID: string;
};
const Folder: React.FC<FolderComponentProps> = ({
                                                    children,
                                                    text,
                                                    divClassName,
                                                    arrowID
                                                }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const toggle = () => setIsExpanded(prev => !prev);
    return (
        <div className={divClassName}>
            <div className="folder-id" onClick={toggle}>
                <div
                    id={arrowID}
                    className={`arrow-icon ${!isExpanded ? "rotated" : ""}`}
                >
                    <ArrowIcon/>
                </div>
                {isExpanded ? <FolderOpenIcon/> : <FolderClosedIcon/>}
                <div className="folder-title">{text}</div>
            </div>
            {isExpanded && <div className="folder-children">
                <div className="folder-drop-inner">
                    {children}
                </div>
            </div>}
        </div>
    );
};

export default Folder;
