import * as THREE from 'three';
import { ShaderMaterial, Vector3 } from 'three';
import { ShaderTypes } from "./types";

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


/**
 * Reflexion methods
 */

function getAllPropertyNames(obj: any) {
    let props: string[] = [];

    do {
        Object.getOwnPropertyNames(obj).forEach(function (prop) {
            if (props.indexOf(prop) === -1) {
                props.push(prop);
            }
        });
    } while (obj = Object.getPrototypeOf(obj));

    return props;
}

export function extend<First, Second>(first: First, second: Second): First & Second {
    const result: Partial<First & Second> = {};

    getAllPropertyNames(first).forEach(prop => {
        (<First>result)[prop] = first[prop];
    })
    getAllPropertyNames(second).forEach(prop => {
        (<Second>result)[prop] = second[prop];
    })

    return <First & Second>result;
}
