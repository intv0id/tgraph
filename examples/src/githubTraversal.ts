import {nodesCollection, verticesCollection, Node, Vertex} from "../../src/types/GraphComponents"
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

    public static getUserGraph(options:userGraphOptions): Graph<IGithubData,null> {
        let accountsList: string[] = [options.ghUserName];
        let nodes: nodesCollection<IGithubData> = {};
        let vertices: verticesCollection<null> = [];
        while (accountsList.length > 0){
            getGhData(<IRequest<IUserData>> {UserName: accountsList.pop()}).then(
                ud => nodes[ud.id] = new Node<IUserData>(ud.name, ud.id.toString(), ud, this.nodeParams)
                );
            
        }
        return new Graph<IGithubData,null>(nodes, vertices);
    }
}