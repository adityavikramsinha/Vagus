import React, { useState } from 'react';
import { Folder } from '../svgIcons/folderSVGIconComponent';
import { ArrowIcon } from '../svgIcons/arrowSVGIcons';
import '../css/navbar.css';

export function FolderComponent(props: any) {
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
    setTimeout(() => {
      document.getElementById(id).style.transform = value;
    }, 1)
  }
  return (
    <div className={props.divClassName}>
      <div className="folder-id">
        {isExpanded && <ArrowIcon id={props.arrowID} onClick={() => changeState(props.arrowID, "rotate(-90deg)")} />}
        {!isExpanded && <ArrowIcon id={props.arrowID} onClick={() => changeState(props.arrowID, "rotate(0deg)")} />}
        {isExpanded && <Folder fill={props.colorOfFolder} onClick={() => changeState(props.arrowID, "rotate(-90deg)")} />}
        {!isExpanded && <Folder fill={props.colorOfFolder} onClick={() => changeState(props.arrowID, "rotate(0deg)")} />}
        {isExpanded && <div className="folder-title" onClick={() => changeState(props.arrowID, "rotate(-90deg)")}>{props.text}{topLevel && <InsideText />}</div>}
        {!isExpanded && <div className="folder-title" onClick={() => changeState(props.arrowID, "rotate(0deg)")}>{props.text}{topLevel && <InsideText />}</div>}
      </div>
      {isExpanded && props.children}
    </div>
  )
}
