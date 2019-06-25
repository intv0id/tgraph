import * as THREE from 'three';
import { NodeMesh, EdgeMesh, ArrowMesh } from "./graphTypes";
export declare class Optimizer {
    nodes: NodeMesh[];
    edges: EdgeMesh[];
    arrows: ArrowMesh[];
    directed: boolean;
    nodeNameToPosition: Map<string, number>;
    iterations: number;
    forceStrength: number;
    dampening: number;
    maxVelocity: number;
    maxDistance: number;
    delta: THREE.Vector3;
    constructor(nodes: NodeMesh[], edges: EdgeMesh[], arrows: ArrowMesh[], directed: boolean, nodeNameToPosition: Map<string, number>, iterations?: number, forceStrength?: number);
    reset(): void;
    run(): void;
    iterate(): void;
}
