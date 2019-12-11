import { SphereGeometry, CylinderGeometry, Matrix4, Euler } from "three";

let CONSTS = {
    geometry:{
        sphere: new SphereGeometry(this.options.nodeSize, 16, 12),
        cylinder: new CylinderGeometry(this.options.edgeSize, this.options.edgeSize, 1, 32, 3, false),
        cone: new CylinderGeometry(this.options.edgeSize, this.options.arrowSize, 2 * this.options.arrowSize, 32, 3, false),
    },
} 

// This orients the cylinder primitive so lookAt() works properly
let matrix = new Matrix4().makeRotationFromEuler(new Euler(Math.PI / 2, Math.PI, 0));
CONSTS.geometry.cylinder.applyMatrix(matrix);
CONSTS.geometry.cone.applyMatrix(matrix);

export default CONSTS;