import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GraphParameters } from '../../src/types/GraphParameters';
import { GithubGraphApp } from './components/GitHubGraphApp';

let graphParams = new GraphParameters();

ReactDOM.render(
    <GithubGraphApp graphParams={graphParams} />,
    document.getElementById('app')
);


