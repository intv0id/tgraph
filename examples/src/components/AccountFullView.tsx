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
            <h2 className="accountLogin">
                <a href={this.props.account.data.html_url}>{this.props.account.name}</a>
                <br />
                {
                    this.props.account.data.email ?
                        <a href={`mailto://${this.props.account.data.email}`}>📧</a> :
                        null
                }
            </h2>
            <img className="avatar" src={this.props.account.data.avatar_url} />
            {
                this.props.account.data.name ?
                    <p><b>Name : </b>{this.props.account.data.name}</p> :
                    null
            }
            {
                this.props.account.data.company ?
                    <p><b>Company : </b>{this.props.account.data.company}</p> :
                    null
            }
            {
                this.props.account.data.blog ?
                    <p><b>Blog : </b><a href={this.props.account.data.blog}>{this.props.account.data.blog}</a></p> :
                    null
            }
            {
                this.props.account.data.location ?
                    <p><b>Location : </b>{this.props.account.data.location}</p> :
                    null
            }
            <p><q>{this.props.account.data.bio}</q></p>
            <p>
                {this.props.account.data.followers} 🔼
                {"   "}
                {this.props.account.data.following} 🔽
                {"   "}
                {this.props.account.data.public_repos} 📚
            </p>
        </div>
    }
}