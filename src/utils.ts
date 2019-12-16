import * as THREE from 'three';
import { ShaderMaterial, Vector3 } from 'three';
import { ShaderTypes } from "./types/Shaders";

export function randomVector3() {
    return new Vector3(Math.random(), Math.random(), Math.random());
}

export function makeMaterial(color: string, shaderType: ShaderTypes = ShaderTypes.BASIC): ShaderMaterial {
    let colorInt = parseInt(color, 16);
    let material = null;

    let materialName = 'Mesh' + shaderType.charAt(0).toUpperCase() + shaderType.slice(1) + 'Material';
    material = new THREE[materialName]({ color: colorInt });

    material.needsUpdate = true;
    return material
}

export function mergeMaps<T, U>(map1: Map<T, U>, map2: Map<T, U>): Map<T, U> {
    return new Map([
        ...Array.from(map1.entries()),
        ...Array.from(map2.entries())
    ]);
}





