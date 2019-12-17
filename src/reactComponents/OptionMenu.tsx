import * as React from 'react';
import { Component } from 'react';
import { Vector2 } from 'three';
import { IMenuAction } from '../types/MenuAction';
import "../styles/MenuStyles.scss";

export interface IOptionMenuProps {
    location: Vector2,
    menuActionItems: Map<string, IMenuAction>,

};

export class OptionMenu extends Component<IOptionMenuProps> {

    actionToElement([key, action]:[string, IMenuAction]) {
        return <li
            key={key}
            className={"menuItem"}
            onClick={action.action ? (e) => { action.action(this.props.location); } : null}>
            {
                action.href ?
                    <a
                        href={action.href || null}
                        download={action.downloadName || null}
                        className={"menuLinkAction"} >
                        {action.text}
                    </a> :
                    action.text
            }
        </li>
    }

    render() {
        return <div
            style={{ left: `${this.props.location.x}px`, top: `${this.props.location.y}px`, position: 'absolute' }}
            className={"menuContainer"}>
            <ul className={"menuList"}>
                {
                    Array.from(this.props.menuActionItems.entries()).map(this.actionToElement.bind(this))
                }
            </ul>
        </div>
    }
}