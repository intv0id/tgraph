import * as THREE from 'three';
import { ShaderTypes } from "./types";
export declare class GraphOptions {
    runOptimization: boolean;
    shaderType: ShaderTypes;
    showSave: boolean;
    z: number;
    rotateSpeed: number;
    nodeSize: number;
    edgeSize: number;
    arrowSize: number;
    clickableNodes: boolean;
    hoverableNodes: boolean;
    onExitHover: Function;
    onEnterHover: Function;
    onNodeClickAction: Function;
}
interface IDeserializable {
    serialize: () => void;
    deserialize: (json: any) => void;
}
declare class Deserializable implements IDeserializable {
    serialize(): any;
    deserialize(json: any): void;
}
declare class DefaultDeserializable extends Deserializable {
    deserialize(json: any): void;
}
export declare class GraphNode extends DefaultDeserializable {
    name: string;
    color: string;
    hoverColor: string;
    label: string;
    size: number;
    location: THREE.Vector3;
    url: string;
    force: THREE.Vector3;
    constructor(name?: string, color?: string, hoverColor?: string, label?: string, size?: number, location?: THREE.Vector3, url?: string, force?: THREE.Vector3);
}
export declare class GraphEdge extends DefaultDeserializable {
    color: string;
    hoverColor: string;
    size: number;
    label: string;
    src: string;
    dst: string;
    constructor(src?: string, dst?: string, color?: string, hoverColor?: string, size?: number, label?: string);
}
export declare class Graph extends Deserializable {
    nodes: GraphNode[];
    edges: GraphEdge[];
    directed: boolean;
    constructor(nodes?: GraphNode[], edges?: GraphEdge[], directed?: boolean);
    serialize(): any;
    deserialize(json: any): void;
}
export declare type NodeMesh = THREE.Mesh & GraphNode;
export declare type EdgeMesh = THREE.Mesh & GraphEdge;
export declare type ArrowMesh = THREE.Mesh;
export {};
