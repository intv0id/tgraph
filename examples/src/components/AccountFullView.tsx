import * as React from 'react';
import { Component } from 'react';
import { IUserData } from '../githubTraversal';
import { Node } from '../../../src/types/GraphComponents';

export interface IAccountFullViewState { }

export interface IAccountFullViewProps {
    account: Node<IUserData>
}

export class AccountFullView extends Component<IAccountFullViewProps, IAccountFullViewState>{
    render() {
        return <div className="AccountFullView">
            <p>{this.props.account.name}</p>
            <br/>
            <img src={this.props.account.data.avatar_url}/>
            <br/>
            <p>{JSON.stringify(this.props.account.data)}</p>
        </div>
    }
}