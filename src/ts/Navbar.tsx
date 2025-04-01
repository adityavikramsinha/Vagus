import * as React from "react";
import '../css/navbar.css';
import { ProjectIcon } from '../svgIcons/projectSVGIconComponent';
import * as ActionIcons from '../svgIcons/actionButtons';
import { FolderComponent } from "./folderStruct";
import { TSXFile, IOFile, BATFile, SYSFile, MDFile, GUIFile } from "./fileStruct";
import { StopButtonClick, StartButtonClick, PrevButtonClick } from "./ActionButtonsFunctionality";
import currentState from './GlobalState';
import { RemoveAllClasses } from './ActionButtonsFunctionality';
import Node from "./Node";

export default class Navbar extends React.Component {

  getColor(identifier : string): string{
    return `#${currentState.cssVariables().get(identifier)}`
  }
  render() {
    return (
      <div className="navbar">
        <div className="header">
          <div className="title">Vagus</div>
          <div className="description">{"{\"Latin\":\"wandering\",\"purpose\":\"algorithms\"}"}</div>
        </div>
        <div className="project">
          <ProjectIcon />
          <p className="project-title">Vagus</p>
          <div className="buttons">
            <ActionIcons.StopButtonIcon onClick={() => {
              StopButtonClick();
            }} />
            <ActionIcons.PrevButtonIcon onClick={() => {
              PrevButtonClick();
            }} />
            <ActionIcons.RunButtonIcon onClick={() => {
              let currentNode: Node<number> = currentState.graph().nodes().get(currentState.startNode())
              RemoveAllClasses(1, []);
              if (currentState.run()) StartButtonClick(currentNode, true);
              else if (!currentState.run()) {
                currentState.changeRun();
                StartButtonClick(currentNode, false)
              }
            }} />
          </div>
        </div>
        <div className="folder-panel">
          <FolderComponent colorOfFolder={this.getColor('solid-red')} text="graphs" divClassName="folder" arrowID="vagus-master-arrow">
            <div className="advanced-cp-border">
              <FolderComponent colorOfFolder={this.getColor('solid-red')} text="advanced-control-panel" divClassName="folder advanced-cp-comp" arrowID="advanced-cp-arrow" >
                <div className="advanced-cp-border">
                  <FolderComponent colorOfFolder={this.getColor('light-red')} text="algorithms" divClassName="folder advanced-cp-comp" arrowID="algorithms-arrow" >
                    <div className="folder-drop-inner">
                      <FolderComponent colorOfFolder={this.getColor('light-red')} text="heuristic" divClassName="folder advanced-cp-comp" arrowID="heuristic-arrow">
                        <div className="folder-drop-inner">
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="aStarSearch.tsx" divID="tsx-1" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="bestFirstSearch.tsx" divID="tsx-2" />
                        </div>
                      </FolderComponent>
                      <FolderComponent colorOfFolder={this.getColor('light-red')} text="un-weighted" divClassName="folder advanced-cp-comp" arrowID="un-weighted-arrow">
                        <div className="folder-drop-inner">
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="breadthFirstSearch.tsx" divID="tsx-3" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="depthFirstSearch.tsx" divID="tsx-4" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="randomWalk.tsx" divID="tsx-5" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="bestFirstSearch.tsx" divID="tsx-6" />
                        </div>
                      </FolderComponent>
                      <FolderComponent colorOfFolder={this.getColor('light-red')} text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow" >
                        <div className="folder-drop-inner">
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="aStarSearch.tsx" divID="tsx-7" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="dijkstrasSearch.tsx" divID="tsx-8" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="bellmanFord.tsx" divID="tsx-9" />
                          <TSXFile divClassName="file tsx-file" pClassName="tsx-name file-name" text="biDirectionalSearch.tsx" divID="tsx-10" />
                        </div>
                      </FolderComponent>
                    </div>
                  </FolderComponent>
                  <FolderComponent colorOfFolder={this.getColor('blue')} text="addableNodes" divClassName="folder advanced-cp-comp" arrowID="addable-arrow">
                    <div className="folder-drop-inner">
                      <IOFile divClassName="file io-file" pClassName="node-name file-name" text="startNode.io" divID="io-1" />
                      <IOFile divClassName="file io-file" pClassName="node-name file-name" text="endNode.io" divID="io-2" />
                      <IOFile divClassName="file io-file" pClassName="node-name file-name" text="bombNode.io" divID="io-3" />
                      <IOFile divClassName="file io-file" pClassName="node-name file-name" text="weightNode.io" divID="io-4" />
                      <IOFile divClassName="file io-file" pClassName="node-name file-name" text="wallNode.io" divID="io-5" />
                    </div>
                  </FolderComponent>
                  <FolderComponent colorOfFolder={this.getColor('green')} text="mazes" divClassName="folder advanced-cp-comp" arrowID="mazes-arrow">
                    <div className="folder-drop-inner">
                      <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="none.bat" divID="bat-1" />
                      <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateRandomMaze.bat" divID="bat-2" />
                      <FolderComponent colorOfFolder={this.getColor('green')} text="wall" divClassName="folder advanced-cp-comp" arrowID="wall-arrow">
                        <div className="folder-drop-inner">
                          <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateLeastCostPathBlocker.bat" divID="bat-3" />
                          <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateBlockedRidges.bat" divID="bat-4" />
                          <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateBlockedRandomMaze.bat" divID="bat-5" />
                        </div>
                      </FolderComponent>
                      <FolderComponent colorOfFolder={this.getColor('green')} text="weighted" divClassName="folder advanced-cp-comp" arrowID="weighted-arrow" >
                        <div className="folder-drop-inner">
                          <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateWeightedRidges.bat" divID="bat-6" />
                          <BATFile divClassName="file bat-file" pClassName="maze-name file-name" text="generateWeightedRandomMaze.bat" divID="bat-7" />
                        </div>
                      </FolderComponent>
                    </div>
                  </FolderComponent>
                  <FolderComponent colorOfFolder={this.getColor('yellow')} text="speeds" divClassName="folder advanced-cp-comp" arrowID="speeds-arrow">
                    <div className="folder-drop-inner">
                      <SYSFile divClassName="file sys-file" pClassName="speed-name file-name" text="25percent.sys" divID="sys-1" />
                      <SYSFile divClassName="file sys-file" pClassName="speed-name file-name" text="50percent.sys" divID="sys-2" />
                      <SYSFile divClassName="file sys-file" pClassName="speed-name file-name" text="100percent.sys" divID="sys-3" />
                    </div>
                  </FolderComponent>
                </div>
              </FolderComponent>
              <FolderComponent colorOfFolder={this.getColor('solid-red')} text="legend" divClassName="folder advanced-cp-comp" arrowID="legend-arrow">
                <div className="folder-drop-inner">
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="bombNode.gui" type="bomb" divID="gui-1" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="shortestPathNode.gui" type="shortest-path" divID="gui-2" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="wallNode.gui" type="wall" divID="gui-3" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="visitedNode.gui" type="visited" divID="gui-4" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="unvisitedNode.gui" type="unvisited" divID="gui-5" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="startNode.gui" type="start-node" divID="gui-6" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="endNode.gui" type="end-node" divID="gui-7" />
                  <GUIFile divClassName="file gui-file" pClassName="legend-name file-name" text="weightNode.gui" type="weight" divID="gui-8" />
                </div>
              </FolderComponent>
              <MDFile divClassName="folder-less-file file md-file advanced-cp-comp" pClassName="file-name" text="settings.json" divID="md-1"/>
            </div>
          </FolderComponent>
        </div>
      </div>
    );
  }
}
