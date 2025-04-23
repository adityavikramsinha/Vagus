import * as React from "react";
import * as FolderIcons from "./FolderIcons";
import cn from "../../visualise-graphs/css/cn";

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
        cursor: "pointer "
    }

    const arrowClasses = cn({
        "rotate-[-90deg]": !isExpanded
    });
    const folderIconClasses = cn(
        "folder-icon",
        "transition-transform",
        "transition-opacity",
        isExpanded
            ? "transform scale-[1.05] opacity-100"
            : "transform scale-[0.95] opacity-[0.85]"
    );
    return (
        <div style={style}>
            <div className="flex flex-nowrap max-w-2xs items-center gap-1" onClick={toggle}>
                <div className={arrowClasses}>
                    <FolderIcons.ArrowIcon/>
                </div>
                <div className={folderIconClasses}>
                    {isExpanded ? <FolderIcons.FolderOpenIcon/> : <FolderIcons.FolderClosedIcon/>}
                </div>
                <p className="text-xs font-light">{name}</p>
            </div>
            {isExpanded &&
                <div>
                    {children}
                </div>}
        </div>
    );
};

export default Folder;
