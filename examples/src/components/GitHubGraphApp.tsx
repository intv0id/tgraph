import * as React from 'react';
import { Component } from 'react';
import { GraphParameters } from '../../../src/types/GraphParameters';
import { githubConnections, IGithubData, IRelationData, IUserData, IUserGraphContract, GithubRetrievalError } from '../githubTraversal';
import GraphCanvas from '../../../src/reactComponents/GraphComponent';
import { Graph } from '../../../src/types/Graph';
import { Node, GraphElement } from '../../../src/types/GraphComponents';
import { ShaderTypes, MeshParameters } from '../../../src';
import { AccountOverview } from './AccountOverview';
import { AccountFullView } from './AccountFullView';
import { Vector2 } from 'three';
import {HelpPanel} from './HelpPanel'
import {SearchPanel} from './SearchPanel'
import { PanelKinds } from '../panels';

export interface IAppState {
    displayPanel: PanelKinds;
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

    displayPanel(panelType: PanelKinds){
        this.setState({...this.state, displayPanel: panelType})
    }
    
    hidePanel(){
        this.setState({...this.state, displayPanel: PanelKinds.NONE})
    }

    render() {
        let hoverInfos = null;
        if (this.state.selectedElement && this.state.selectedElement.name) {
            hoverInfos = <AccountOverview
                account={this.state.selectedElement as Node<IUserData>}
                mouseLocation={this.mouseLocation}
            />;
        }
        let rootNode = this.state.graphData.nodes.get(this.state.rootNodeId);
        let rootNodeInfos = null;
        if (rootNode) {
            rootNodeInfos = <AccountFullView account={rootNode as Node<IUserData>} />;
        }
        return (
            
            <div
                id="GraphApp"
                onMouseMove={(e) => { this.mouseLocation = new Vector2(e.clientX, e.clientY) }} >

                {(this.state.displayPanel == PanelKinds.HELP) ? <HelpPanel hide={this.hidePanel.bind(this)}/> : null}
                {(this.state.displayPanel == PanelKinds.SEARCH) ? <SearchPanel hide={this.hidePanel.bind(this)} updateGithubLogin={this.setGraphData.bind(this)}/> :  null}

                <div className='titleBar'>
                    <h1>Github relations finder</h1>
                </div>

                <div className="buttons">
                    <span className="searchButton" title="Search a github user" onClick={() => this.displayPanel(PanelKinds.SEARCH)}>🔎</span>
                    <span className="githubButton" title="Discover tgraph on Github" onClick={() => window.location.href="https://github.com/intv0id/tgraph"}>{"</>"}</span>
                    <span className="helpButton" title="Help" onClick={() => this.displayPanel(PanelKinds.HELP)}>?</span>
                </div>

                <GraphCanvas<IGithubData, IRelationData>
                    graphData={this.state.graphData}
                    graphParams={this.props.graphParams} />

                {rootNodeInfos}
                <br />
                {hoverInfos}
            </div>);
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
            (n) => { },
        )
    );
    readonly state: IAppState = {
        displayPanel: PanelKinds.NONE,
        ghLogin: "intv0id",
        graphData: new Graph(new Map<string, Node<IGithubData>>(), []),
        selectedElement: undefined,
        rootNodeId: undefined,
    };
    mouseLocation: Vector2;
}