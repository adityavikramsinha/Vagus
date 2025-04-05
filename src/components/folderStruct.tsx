import React, { useState } from 'react';
import { FolderOpen, FolderClosed } from './folderSVGIconComponent';
import { ArrowIcon } from './arrowSVGIcons';


type FolderComponentProps = {
  children: React.ReactNode,
  text : string,
  divClassName : string,
  arrowID : string,

}


export const FolderComponent :React.FC<FolderComponentProps> =(props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  let topLevel: boolean = false;
  let InsideText = () => {
    return (
      <b>[master]</b>
    )
  }
  if (props.text === 'graphs') {
    topLevel = true;
  }
  const changeState = (id: string, value: string) => {
    setIsExpanded(!isExpanded);
    requestAnimationFrame(() => {
      document.getElementById(id).style.transform = value;
    })
  }
  return (
    <div className={props.divClassName}>
      <div className="folder-id">
        {isExpanded && <ArrowIcon id={props.arrowID} onClick={() => changeState(props.arrowID, "rotate(-90deg)")} />}
        {!isExpanded && <ArrowIcon id={props.arrowID} onClick={() => changeState(props.arrowID, "rotate(0deg)")} />}
        {isExpanded && <FolderOpen  onClick={() => changeState(props.arrowID, "rotate(-90deg)")} />}
        {!isExpanded && <FolderClosed onClick={() => changeState(props.arrowID, "rotate(0deg)")} />}
        {isExpanded && <div className="folder-title" onClick={() => changeState(props.arrowID, "rotate(-90deg)")}>{props.text}{topLevel && <InsideText />}</div>}
        {!isExpanded && <div className="folder-title" onClick={() => changeState(props.arrowID, "rotate(0deg)")}>{props.text}{topLevel && <InsideText />}</div>}
      </div>
      {isExpanded && props.children}
    </div>
  )
}

export default FolderComponent;
