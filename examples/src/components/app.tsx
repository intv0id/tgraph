import * as React from 'react';
import { Component } from 'react';
import { GraphParameters } from '../../../src/types/GraphParameters';
import { githubConnections, IGithubData, IRelationData, IUserData, IUserGraphContract } from '../githubTraversal';
import GraphCanvas from '../../../src/reactComponents/GraphComponent';
import { Graph } from '../../../src/types/Graph';
import { Node, GraphElement } from '../../../src/types/GraphComponents';
import { ShaderTypes, MeshParameters } from '../../../src';
import { AccountDetails } from './AccountDetails';
import { AccountFullView } from './AccountFullView';
import { Vector2 } from 'three';

export interface IAppState {
    ghLogin: string,
    graphData: Graph<IGithubData, IRelationData>,
    selectedElement: GraphElement,
    rootNodeId: string | undefined,
}

export interface IAppProps {
    graphParams: GraphParameters
}

export class GithubGraphApp extends Component<IAppProps, IAppState>{
    setSelectedElement(element: GraphElement) {
        document.body.style.cursor = "pointer";
        this.setState({
            ...this.state,
            selectedElement: element,
        });
    }

    unSetSelectedElement(element: GraphElement) {
        document.body.style.cursor = "auto";
        this.setState({
            ...this.state,
            selectedElement: undefined,
        });
    }

    async setGraphData(login: string) {
        let userGraph: IUserGraphContract = await this.graphGetter.getUserGraph({
            ghUserName: login,
            levels: 1,
            followersPerAccountLimit: 10,
            reposPerAccountLimit: 10,
        });
        this.setState({
            ...this.state,
            ghLogin: login,
            graphData: userGraph.graph,
            rootNodeId: userGraph.rootNodeId
        });
    }

    onClickUserNode(element: Node<IUserData>) {
        this.setGraphData(element.data.login);
    }

    async componentDidMount() {
        await this.setGraphData(this.state.ghLogin);
    }

    render() {
        let hoverInfos = null;
        if (this.state.selectedElement && this.state.selectedElement.name){
            hoverInfos = <AccountDetails 
                account={this.state.selectedElement as Node<IUserData>}
                mouseLocation={this.mouseLocation}
            />;
        }
        let rootNode = this.state.graphData.nodes.get(this.state.rootNodeId);
        let rootNodeInfos = null;
        if (rootNode){
            rootNodeInfos = <AccountFullView account={rootNode as Node<IUserData>}/>;
        }
        return <div id="GraphApp" onMouseMove={(e) => {this.mouseLocation
        = new Vector2(e.clientX, e.clientY)}}>
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
        selectedElement: undefined,
        rootNodeId: undefined,
    };
    mouseLocation: Vector2;
}