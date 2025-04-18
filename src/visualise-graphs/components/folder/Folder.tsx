import * as React from "react";
import * as FolderIcons from "@graph/components/folder/FolderIcons";
import cn from "../../css/cn";

type FolderProps = {
    children: React.ReactNode;
    name: string;
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
                                           name
                                       }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const toggle = () => setIsExpanded(prev => !prev);
    const style = {
        paddingLeft: `${name === "graphs" ? "18px" : "20px"}`,
        cursor:"pointer "
    }

    const arrowClasses = cn({
        "arrow-icon": true,
        "rotated" : !isExpanded
    })
    const folderIconClasses = cn({
        "folder-icon" : true,
        "open" : isExpanded,
        "close" : !isExpanded
    })
    return (
        <div style={style} >
            <div className="folder-misc" onClick={toggle}>
                <div className={arrowClasses}>
                    <FolderIcons.ArrowIcon/>
                </div>
                <div className={folderIconClasses}>
                    {isExpanded ? <FolderIcons.FolderOpenIcon/> : <FolderIcons.FolderClosedIcon/>}
                </div>
                <div className="folder-name">{name}</div>
            </div>
            {isExpanded &&
                <div className="folder-children">
                    <div>
                        {children}
                    </div>
                </div>}
        </div>
    );
};

export default Folder;
