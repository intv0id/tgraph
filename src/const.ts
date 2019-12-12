import { SphereGeometry, CylinderGeometry, Matrix4, Euler } from "three";

// This orients the cylinder primitive so lookAt() works properly
let matrix = new Matrix4().makeRotationFromEuler(new Euler(Math.PI / 2, Math.PI, 0));

let CONSTS = {
    geometry:{
        sphere: (nodeSize) => new SphereGeometry(nodeSize, 16, 12),
        cylinder: (edgeSize) => new CylinderGeometry(edgeSize, edgeSize, 1, 32, 3, false).applyMatrix(matrix),
        cone: (edgeSize, arrowSize) => new CylinderGeometry(edgeSize, arrowSize, 2 * arrowSize, 32, 3, false).applyMatrix(matrix),
    },
};

export default CONSTS;