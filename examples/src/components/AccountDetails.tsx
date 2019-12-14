import * as React from 'react';
import { Component } from 'react';
import { IUserData } from '../githubTraversal';
import { Node } from '../../../src/types/GraphComponents';

export interface IAccountDetailsState { }

export interface IAccountDetailsProps {
    account: Node<IUserData>
}

export class AccountDetails extends Component<IAccountDetailsProps, IAccountDetailsState>{
    render() {
        return <div className="AccountOverview">
            <p>{this.props.account.name}</p>
            <br/>
            <p>{JSON.stringify(this.props.account.data)}</p>
        </div>
    }
}