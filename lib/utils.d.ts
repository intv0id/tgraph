import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { ShaderTypes } from "./types";
/**
 * Math methods
 */
export declare function randomVector3(): THREE.Vector3;
/**
 * Material methods
 */
export declare function makeMaterial(color: string, shaderType?: ShaderTypes): ShaderMaterial;
export declare function extend<First, Second>(first: First, second: Second): First & Second;
