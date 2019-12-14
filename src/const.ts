import { SphereGeometry, CylinderGeometry, Matrix4, Euler } from "three";

// This orients the cylinder primitive so lookAt() works properly
let matrix = new Matrix4().makeRotationFromEuler(new Euler(Math.PI / 2, Math.PI, 0));

let CONSTS = {
    geometry:{
        sphere: (nodeSize) => new SphereGeometry(2*nodeSize, 16, 12),
        cylinder: (edgeSize) => new CylinderGeometry(0.5 * edgeSize, 0.5 * edgeSize, 1, 32, 3, false).applyMatrix(matrix),
        cone: (edgeSize, arrowSize) => new CylinderGeometry(0.5 * edgeSize, 2 * arrowSize, 4 * arrowSize, 32, 3, false).applyMatrix(matrix),
    },
};

export default CONSTS;