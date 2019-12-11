import { GraphData, nodesCollection, Node, verticesCollection } from "../../src/types";
import { Vector3 } from "three";

export type userGraphOptions = {
    ghUserName:string,
    levels: number,
    followersPerAccountLimit:number,
    reposPerAccountLimit:number,
}

interface IRequest<T> {
    UserName: string
} ;

interface IGithubData {};

interface IUserData extends IGithubData {
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
    public static async getUserGraph(options:userGraphOptions): Promise<GraphData<IGithubData,null>> {
        let accountsList: string[] = [options.ghUserName];
        let nodes: nodesCollection<IGithubData> = {};
        let vertices: verticesCollection<null> = [];
        while (accountsList.length > 0){
            let ud = await getGhData(<IRequest<IUserData>> {UserName: accountsList.pop()})
            nodes[ud.id] = <Node<IGithubData>> {
                name: ud.name,
                color: "000000", // TODO
                hoverColor: "000000", // TODO
                label: ud.id.toString(),
                size: 3, // TODO
                location: new Vector3(), // TODO
                url: ud.html_url,
                force: new Vector3(), // TODO
                data: ud
            }
        }
        return <GraphData<IGithubData,null>>{
            nodes: nodes,
            vertices: vertices,
            isDirected: true,
        }
        
    }
}