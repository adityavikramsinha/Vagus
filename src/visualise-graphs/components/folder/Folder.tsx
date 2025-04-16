import * as React from "react";
import * as FolderIcons from "@graph/components/folder/FolderIcons";

type FolderProps = {
    children: React.ReactNode;
    name: string;
    divClassName: string;
};

/**
 * Folder component for the left navigation bar.
 * @param children Can be Folder(s) or File(s)
 * @param name Name of the Folder
 * @param divClassName is used for the indentation in CSS based on some wonky stuff done in v0.x.
 * @constructor
 */
const Folder: React.FC<FolderProps> = ({
                                                    children,
                                                    name,
                                                    divClassName
                                                }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const toggle = () => setIsExpanded(prev => !prev);
    return (
        <div className={divClassName}>
            <div className="folder-id" onClick={toggle}>
                <div className={`arrow-icon ${!isExpanded ? "rotated" : ""}`}>
                    <FolderIcons.ArrowIcon/>
                </div>
                {isExpanded ? <FolderIcons.FolderOpenIcon/> : <FolderIcons.FolderClosedIcon/>}
                <div className="folder-title">{name}</div>
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
