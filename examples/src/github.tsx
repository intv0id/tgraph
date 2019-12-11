import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GraphCanvas from '../../src/reactComponents/GraphComponent';
import {IGithubData, githubConnections} from "./github_traversal";
import { GraphParameters } from '../../src/types/GraphParameters';


let graphData = githubConnections.getUserGraph({
    ghUserName: "intv0id",
    levels: 1,
    followersPerAccountLimit: 10,
    reposPerAccountLimit: 10,
});
let graphParams = new GraphParameters();

ReactDOM.render(
    <GraphCanvas<IGithubData, null> graphData={graphData} graphParams={graphParams} />, document.getElementById('Container'))