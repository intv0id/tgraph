import { Node, Vertex } from "../../src/types/GraphComponents"
import { Graph } from "../../src/types/Graph";
import { MeshParameters } from "../../src/types/MeshParameters";

export type userGraphOptions = {
    ghUserName: string,
    levels: number,
    followersPerAccountLimit: number,
    reposPerAccountLimit: number,
}

export interface IRequest {
    UserName: string
};

export interface IGithubData { };

export interface IUserData extends IGithubData {
    id: number,
    login: string,
    name: string,
    html_url: string,
    company: string,
    blog: string,
    location: string,
    email: string,
    bio: string,
    public_repos: number,
    public_gists: number,
    followers: number,
    following: number,
    avatar_url: string,
};

export interface IRelationData { };
export interface IFollowsData extends IRelationData { };

export interface IFollowsQuery {login: string, id: string, level: number}

export class githubConnections {
    static nodeParams: MeshParameters<IUserData> = new MeshParameters<IUserData>(1, "00ff00", "ffff00");
    static vertexParams: MeshParameters<IRelationData> = new MeshParameters<IRelationData>(1, "0000ff", "ff00ff");

    public static async getUserGraph(options: userGraphOptions): Promise<Graph<IGithubData, IRelationData>> {
        let nodes: Map<string, Node<IGithubData>> = new Map<string, Node<IGithubData>>();
        let vertices: Vertex<IFollowsData>[] = [];

        let rootNode = await this.getUserData(<IRequest>{ UserName: options.ghUserName });
        nodes.set(rootNode.id.toString(), new Node<IUserData>(rootNode.login, rootNode.id.toString(), rootNode, this.nodeParams));

        let accountToGetFollowersList: IFollowsQuery[] = [{login: rootNode.login, id: rootNode.id.toString(), level: 0}];
        while (accountToGetFollowersList.length > 0) {
            let query = accountToGetFollowersList.pop();
            
            if (query.level < options.levels) {
                let followers = await this.getFollowers(<IRequest>{ UserName: query.login });
                //TODO Limit followers
                followers.forEach(user => {
                    nodes.set(user.id.toString(), new Node<IUserData>(user.login, user.id.toString(), user, this.nodeParams));
                    vertices.push(new Vertex<IFollowsData>(query.id, user.id.toString(), "Follows", {}, true, this.vertexParams));

                    accountToGetFollowersList.push({login: user.login, id: user.id.toString(), level: query.level + 1});
                })
            }
        }

        return new Graph<IGithubData, IRelationData>(nodes, vertices);
    }

    static async getUserData(request: IRequest): Promise<IUserData> {
        let url = `https://api.github.com/users/${request.UserName}`;
        return new Promise(resolve => {
            fetch(url)
                .then(response => response.json())
                .then(body => {
                    resolve(body);
                });
        });
    };

    static async getFollowers(request: IRequest): Promise<IUserData[]> {
        let url = `https://api.github.com/users/${request.UserName}/followers`;
        return new Promise(resolve => {
            fetch(url)
                .then(response => response.json())
                .then(body => {
                    resolve(body);
                });
        });
    };
}