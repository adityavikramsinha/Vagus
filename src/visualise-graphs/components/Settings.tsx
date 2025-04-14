import * as React from "react";
import currentState from "../api/BackendStateManager";
import {JSX} from "react";
import StopButton from "./action-buttons/StopButton";

export default class Settings extends React.Component {
    static toggleDisplay = () => {
        let settings = document.querySelector(".settings-outer") as HTMLElement;
        if (settings.style.display === "none") {
            settings.style.display = "block";
            updateIDClass('left-cmd', [], ['blur-ele']);
            updateIDClass('hex-board', [], ['blur-ele']);
        } else {
            settings.style.display = "none";
            updateIDClass('left-cmd', ['blur-ele'], []);
            updateIDClass('hex-board', ['blur-ele'], []);
        }
    }
    static renderKey = (mapper: Map<string, string>): Array<JSX.Element> => {
        let keyJSX: Array<JSX.Element> = [];
        let i: number = 0;
        mapper.forEach((value, key) => {
            keyJSX.push(
                <div className="key-value" id={`key-value-${i}`} key={i}>
                    <div className="keys-div"><span className="blue" id={`key-${i}`}> {`"${key}"`}</span>: </div>
                    <div className="values-div"><span className="blue">"#<span className="blue" id={`value-${i}`} contentEditable="true" suppressContentEditableWarning={true}>{`${value}`}</span>"</span>,</div>
                </div>
            );
            i++;
        });
        return keyJSX;
    }
    static updateCSS = () => {
        let keyEle: HTMLElement, valueEle: HTMLElement;
        let key: string, value: string;
        let keyValueMapFresh: Map<string, string> = new Map<string, string>();
        for (let i = 0; i < 35; i++) {
            keyEle = document.getElementById(`key-${i}`) as HTMLElement;
            valueEle = document.getElementById(`value-${i}`) as HTMLElement;
            key = keyEle.textContent.substring(2, keyEle.textContent.length - 1);
            value = valueEle.textContent;
            keyValueMapFresh.set(key, value);
        }
        keyValueMapFresh.forEach((value, key) => {
            currentState.changeCSSVariable("color", `--${key}`, `#${value}`);
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="settings-outer" style={{ display: 'none' }}>
                    <div className="settings-inner">
                        <div className="settings-master-header">
                            <div className="settings-buttons">
                                <StopButton onClick={()=>{
                                    Settings.toggleDisplay();
                                    Settings.updateCSS();
                                }}/>
                            </div>
                            <div className="settings-header">
                                <p>settings.json</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            <div className="braces"><p>{"{"}</p></div>
                            <div className="key-value-master-drop">
                                <div className="key-value-master">
                                    {Settings.renderKey(currentState.cssVariables())}
                                </div>
                            </div>
                            <div className="braces"><p>{"}"}</p></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
