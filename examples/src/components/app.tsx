import * as React from 'react';
import { Component } from 'react';
import { GraphParameters } from '../../../src/types/GraphParameters';
import { githubConnections, IGithubData, IRelationData, IUserData } from '../githubTraversal';
import GraphCanvas from '../../../src/reactComponents/GraphComponent';
import { Graph } from '../../../src/types/Graph';
import { Node, GraphElement } from '../../../src/types/GraphComponents';
import { ShaderTypes, MeshParameters } from '../../../src';
import { AccountDetails } from './AccountDetails';

export interface IAppState {
    ghLogin: string,
    graphData: Graph<IGithubData, IRelationData>,
    selectedElement: GraphElement
}

export interface IAppProps {
    graphParams: GraphParameters
}

export class GithubGraphApp extends Component<IAppProps, IAppState>{
    setSelectedElement(element: GraphElement) {
        this.setState({
            ...this.state,
            selectedElement: element,
        });
    }

    unSetSelectedElement(element: GraphElement) {
        this.setState({
            ...this.state,
            selectedElement: undefined,
        });
    }

    async setGraphData() {
        let graphData = await this.graphGetter.getUserGraph({
            ghUserName: this.state.ghLogin,
            levels: 1,
            followersPerAccountLimit: 10,
            reposPerAccountLimit: 10,
        });
        this.setState({
            ...this.state,
            graphData: graphData,
        });
    }

    onClickUserNode(element: Node<IUserData>) {
        this.setState({...this.state, ghLogin: element.data.login});
        this.setGraphData();
    }

    async componentDidMount() {
        await this.setGraphData();
    }

    render() {
        let hoverInfos = null;
        if (this.state.selectedElement && this.state.selectedElement.name){
            hoverInfos = <AccountDetails account={this.state.selectedElement as Node<IUserData>}/>;
        }
        let rootNodeInfos = null;
        //TODO RootNode infos
        return <div id="GraphApp">
            <GraphCanvas<IGithubData, IRelationData> graphData={this.state.graphData} graphParams={this.props.graphParams} />
            {rootNodeInfos}
            <br/>
            {hoverInfos}
        </div>;
    }

    readonly graphGetter: githubConnections = new githubConnections(
        new MeshParameters<IUserData>(
            1,
            "ff0000",
            "ffff00",
            ShaderTypes.BASIC,
            this.setSelectedElement.bind(this),
            this.unSetSelectedElement.bind(this),
            this.onClickUserNode.bind(this),
        ),
        new MeshParameters<IUserData>(
            1,
            "00ff00",
            "ffff00",
            ShaderTypes.BASIC,
            this.setSelectedElement.bind(this),
            this.unSetSelectedElement.bind(this),
            this.onClickUserNode.bind(this),
        ),
        new MeshParameters<IRelationData>(
            1,
            "0000ff",
            "ff00ff",
            ShaderTypes.BASIC,
            this.setSelectedElement.bind(this),
            this.unSetSelectedElement.bind(this),
            (n) => {},            
        )
    );
    readonly state: IAppState = {
        ghLogin: "intv0id",
        graphData: new Graph(new Map<string, Node<IGithubData>>(), []),
        selectedElement: undefined
    };
}