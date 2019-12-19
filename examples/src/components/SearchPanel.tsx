import { Component } from 'react';
import * as React from 'react';
import { BasePanel, IBasePanelProps } from './BasePanel';
import { GithubRetrievalError } from '../githubTraversal';

export interface ISearchPanelProps extends IBasePanelProps {
    updateGithubLogin: (login: string) => void
}

export interface ISearchPanelState {
    error: Error | undefined
}

export class SearchPanel extends Component<ISearchPanelProps, ISearchPanelState> {

    async searchLogin() {
        try {
            await this.props.updateGithubLogin((document.getElementById('loginInput') as HTMLInputElement).value);
            this.setState({ ...this.state, error: undefined });
        } catch (error) {
            if (error instanceof GithubRetrievalError) {
                this.setState({ ...this.state, error: error });
            }
            console.error(error);
        }
    }

    render() {
        return <BasePanel hide={this.props.hide}>
            <div id="searchPanel">
                <form>
                    <input type="text" id="loginInput" placeholder="Github pseudo" />
                    <input type="button" onClick={this.searchLogin.bind(this)} value="Search" />
                </form>
                {
                    this.state.error instanceof GithubRetrievalError ?
                        <p className="error">{"Can't find github account for pseudo "}<i>{this.state.error.login}</i></p> :
                        null
                }
            </div>
        </BasePanel>
    }

    readonly state: ISearchPanelState = {
        error: undefined
    };
}