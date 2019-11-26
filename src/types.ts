import { Vector3, Mesh } from 'three';

/**
 * Display types
 */

export enum ShaderTypes {
    BASIC = "basic",
    PHONG = "phong",
    LAMBERT = "lambert",
};


/**
 * Graph types
 */

export interface Node {
    name: string;
    color: string;
    hoverColor: string;
    label: string;
    size: number;
    location: Vector3;
    url: string;
    force: Vector3;
}

export interface Vertex {
    color: string;
    hoverColor: string;
    size: number;
    label: string;
    src: string;
    dst: string;
}

export type nodesCollection =  { [id: string] : Node; };
export type verticesCollection  = Vertex[];

export interface GraphData {
    nodes: nodesCollection,
    vertices: verticesCollection,
    isDirected: boolean,
}

/**
 * Mesh types
 */

export type NodeMesh = Mesh & Node;
export type VertexMesh = Mesh & Vertex;
export type ArrowMesh = Mesh & Vertex;

export type nodesMeshCollection = { [id: string] : NodeMesh; };
export type verticesMeshCollection = VertexMesh[];
export type arrowsMeshCollection = ArrowMesh[];

export interface GraphMeshes {
    nodes: nodesMeshCollection,
    vertices: verticesMeshCollection,
    arrows?: arrowsMeshCollection,
}