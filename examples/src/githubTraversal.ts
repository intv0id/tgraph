import { Node, Vertex } from "../../src/types/GraphComponents"
import { Graph } from "../../src/types/Graph";
import { MeshParameters } from "../../src/types/MeshParameters";

export type userGraphOptions = {
    ghUserName:string,
    levels: number,
    followersPerAccountLimit:number,
    reposPerAccountLimit:number,
}

export interface IRequest<T> {
    UserName: string
} ;

export interface IGithubData {};

export interface IUserData extends IGithubData {
    id: number,
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

export interface IRelationData {};
export interface IFollowsData extends IRelationData {};

export async function getGhData<IUserData> (request: IRequest<IUserData>): Promise<IUserData> {
    let url = `https://api.github.com/users/${request.UserName}`;
    return new Promise(resolve => {
      fetch(url)
        .then(response => response.json())
        .then(body => {
          resolve(body);
        });
    });
  };

export class githubConnections {
    static nodeParams: MeshParameters<IUserData> = new MeshParameters<IUserData>();

    public static async getUserGraph(options:userGraphOptions): Promise<Graph<IGithubData, IRelationData>> {
        let accountsList: string[] = [options.ghUserName];
        let nodes: Map<string,Node<IGithubData>> = new Map<string,Node<IGithubData>>();
        let vertices: Vertex<IFollowsData>[] = [];
        while (accountsList.length > 0){
            let node = await getGhData(<IRequest<IUserData>> {UserName: accountsList.pop()});
            nodes.set(node.id.toString(), new Node<IUserData>(node.name, node.id.toString(), node, this.nodeParams));            
        }
        
        return new Graph<IGithubData,IRelationData>(nodes, vertices);
    }
}