import * as React from 'react';
import { Component } from 'react';
import { IUserData } from '../githubTraversal';
import { Node } from '../../../src/types/GraphComponents';
import { Vector2 } from 'three';
import { Guid } from 'guid-typescript';
import "../styles/AccountOverviewStyle.scss";

export interface IAccountDetailsProps {
    account: Node<IUserData>,
    mouseLocation: Vector2,
}

export class AccountOverview extends Component<IAccountDetailsProps>{

    move(){
        let htmlElement = document.getElementById(this.componentId);
        htmlElement.style.top = `${this.props.mouseLocation.y.toString()}px`;
        htmlElement.style.left = `${this.props.mouseLocation.x.toString()}px`;
    }

    componentDidMount(){
        this.move();
    }

    componentDidUpdate(){
        this.move();
    }

    render() {
        return <div id={this.componentId} className="AccountOverview">
            <p>{this.props.account.name}</p>
        </div>;
    }

    readonly componentId: string = `AccountDetails${Guid.create().toString()}`;
}