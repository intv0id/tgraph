import { Component } from 'react';
import * as React from 'react';
import "../styles/PanelStyle.scss";

export interface IBasePanelProps {
    hide: () => void
};

export class BasePanel extends Component<IBasePanelProps> {
    render(){
        return <div id="panel"><span className="exit" onClick={this.props.hide}>❌</span>{this.props.children}</div>
    }
}