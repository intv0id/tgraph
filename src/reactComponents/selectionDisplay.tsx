import {Node} from "../types";
import React from "react";

export interface selectionDisplayState<T> {selectedNode: Node<T>};

export default class SelectionDisplay<T> extends React.Component<selectionDisplayState<T>, {}> {
    render(){
        return <div class="description">
            <p><b>{this.props.selectedNode.name}</b></p>
            <br/>
            <p>{this.props.selectedNode.label}</p>
            <br/>
            <p>{this.props.selectedNode.data}</p>
        </div>;
    }
}