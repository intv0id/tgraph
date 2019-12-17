import { Component } from 'react';
import * as React from 'react';
import { BasePanel, IBasePanelProps } from './BasePanel';

export class HelpPanel extends Component<IBasePanelProps> {
    render() {
        return <BasePanel hide={this.props.hide}>
            <div id="helpPanel">
                <h2>Help</h2>
                <div>
                    <p>This app is created to demonstrate the possibilities of the <b>tgraph</b> library.</p>
                    <p>The displayed graph shows connections between users, repositories</p>
                    <p>Using the buttons on the right hand side, you can change parameters, search for a github user, go to the Github repository of <b>tgraph</b> or display this help panel.</p>
                </div>
                <div>
                    <h3>Legend</h3>
                    IN PROGRESS
                </div>
            </div>
        </BasePanel>
    }
}