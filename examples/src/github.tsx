import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GraphCanvas from '../../src/reactComponents/GraphComponent';
import { IGithubData, githubConnections, IRelationData } from "./githubTraversal";
import { GraphParameters } from '../../src/types/GraphParameters';

let graphParams = new GraphParameters();
githubConnections.getUserGraph({
    ghUserName: "intv0id",
    levels: 1,
    followersPerAccountLimit: 10,
    reposPerAccountLimit: 10,
}).then(
    graphData => {
        ReactDOM.render(
            <GraphCanvas<IGithubData, IRelationData> graphData={graphData} graphParams={graphParams} />,
            document.getElementById('app')
        );
    }
);


