import * as THREE from 'three';
import { makeMaterial } from "./utils"

export class GraphOptions {
    runOptimization: boolean = true;
    shader: string = "basic";
    showSave: boolean = true;
    z: number = 100;
    rotateSpeed: number = 0.5;
    nodeSize: number = 2.0;
    edgeSize: number = 0.25;
    arrowSize: number = 1.0;
    clickableNodes: boolean = true;
    hoverableNodes: boolean = true;

    onExitHover: Function = function (node:NodeMesh) {
        let $d = $('.label');
        $d.empty();
        $d.hide();
    }

    onEnterHover: Function = function (node:NodeMesh) {
        let $d = $('.label');
        $d.html(`<p><b>${node.name}</b></p><br><p>${node.label}</p>`);
        $d.show();
    }

    onNodeClickAction: Function = function (nodeObject) {
        window.open(nodeObject.url, '_blank');
    }
}

class Deserializable {
    serialize():any {
        return this;
    }

    deserialize(json) {
        for (let prop in json) {
            if (!json.hasOwnProperty(prop) || !this.hasOwnProperty(prop)) {
                continue;
            }

            if (this[prop] instanceof Deserializable) {
                this[prop] = this[prop].constructor();
                this[prop].deserialize(json[prop]);
            } else {
                this[prop] = json[prop];
            }
        }
    }
}

export class GraphNode extends Deserializable {
    name: string;
    color: string;
    hoverColor: string;
    label: string;
    size: number;
    location: number[];

    constructor(name: string = "", color: string = '0x5bc000', hoverColor: string = '0x5bc0ff', label: string = "", size: number = 2.0, location: number[] = [0, 0, 0]) {
        super()
        this.name = name;
        this.color = color;
        this.hoverColor = hoverColor;
        this.label = label;
        this.size = size;
        this.location = location;
    }
}

export class GraphEdge extends Deserializable {
    color: string;
    hoverColor: string;
    size: number;
    label: string;
    src: string;
    dst: string;

    constructor(src: string = "", dst: string = "", color: string = '0xaaaaaa', hoverColor: string = '0xaaaaff', size: number = 0.25, label: string = "") {
        super()
        this.src = src;
        this.dst = dst;
        this.color = color;
        this.hoverColor = hoverColor;
        this.size = size;
        this.label = label;
    }
}

export class Graph extends Deserializable {
    nodes: GraphNode[];
    edges: GraphEdge[];
    directed: boolean;

    constructor(nodes: GraphNode[] = [], edges: GraphEdge[] = [], directed: boolean = true) {
        super()
        this.nodes = nodes;
        this.edges = edges;
        this.directed = directed;
    }

    serialize():any {
        return {
            nodes: this.nodes.map(x => x.serialize()),
            edges: this.edges.map(x => x.serialize()),
            directed: this.directed,
        }
    }

    deserialize(json) {
        for (let prop in json) {
            switch (prop) {
                case "nodes":
                    this[prop] = json[prop].map(element => {
                        let object = new GraphNode();
                        object.deserialize(element);
                        return object;
                    });
                    break;
                case "edges":
                    this[prop] = json[prop].map(element => {
                        let object = new GraphEdge();
                        object.deserialize(element);
                        return object;
                    });
                    break;
                default:
                    this[prop] = json[prop];
                    break;
            }
        }
    }
}

export type NodeMesh = THREE.Mesh & GraphNode;
export type EdgeMesh = THREE.Mesh & GraphEdge;
export type ArrowMesh = THREE.Mesh;
