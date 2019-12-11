import * as THREE from 'three';
import { GraphMeshes, arrowsMeshCollection, nodesMeshCollection, verticesMeshCollection, GraphData } from "./types";
export declare class Optimizer {
    graphData: GraphData;
    nodes: nodesMeshCollection;
    edges: verticesMeshCollection;
    arrows: arrowsMeshCollection;
    directed: boolean;
    nodeNameToPosition: Map<string, number>;
    iterations: number;
    forceStrength: number;
    dampening: number;
    maxVelocity: number;
    maxDistance: number;
    delta: THREE.Vector3;
    constructor(gm: GraphMeshes, iterations?: number, forceStrength?: number);
    reset(): void;
    run(): void;
    iterate(): void;
}
