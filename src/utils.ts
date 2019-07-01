import * as THREE from 'three';
import { Material } from 'three';

export function makeMaterial(color: string, shaderName: string = "basic"): THREE.ShaderMaterial {
    let colorInt = parseInt(color, 16);
    let material = null;
    if (['basic', 'phong', 'lambert'].includes(shaderName)) {
        let materialName = 'Mesh' + shaderName.charAt(0).toUpperCase() + shaderName.slice(1) + 'Material';
        material = new THREE[materialName]({ color: colorInt });
    } else {
        throw new Error(`Can't create shader of type ${shaderName}!`);
    }
    material.needsUpdate = true;
    return material
}

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
