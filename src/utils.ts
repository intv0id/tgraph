import * as THREE from 'three';
import { ShaderMaterial, Vector3 } from 'three';
import { ShaderTypes } from "./types/Shaders";

/**
 * Math methods
 */

export function randomVector3(){
    return new Vector3(Math.random(), Math.random(), Math.random());
}

/**
 * Material methods
 */

export function makeMaterial(color: string, shaderType: ShaderTypes = ShaderTypes.BASIC): ShaderMaterial {
    let colorInt = parseInt(color, 16);
    let material = null;
    
    let materialName = 'Mesh' + shaderType.charAt(0).toUpperCase() + shaderType.slice(1) + 'Material';
    material = new THREE[materialName]({ color: colorInt });

    material.needsUpdate = true;
    return material
}






