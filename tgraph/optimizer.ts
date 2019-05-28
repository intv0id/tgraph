import * as THREE from 'three';

import { NodeMesh, EdgeMesh, ArrowMesh } from "./graphTypes";


export class Optimizer {
    nodes: NodeMesh
    edges: EdgeMesh;
    arrows: ArrowMesh;
    directed: boolean;
    nodeNameToPosition: Object;
    iterations: number;
    forceStrength: number;
    dampening: number;
    maxVelocity: number;
    maxDistance: number;
    delta: THREE.Vector3;

    constructor(nodes: NodeMesh[], edges: EdgeMesh[], arrows: ArrowMesh[], directed: boolean, nodeNameToPosition: Object, iterations: number = 10000, forceStrength: number = 10.0) {
        this.nodes = nodes;
        this.edges = edges;
        this.arrows = arrows;
        this.nodeNameToPosition = nodeNameToPosition;
        this.directed = directed;
        this.iterations = iterations;
        this.forceStrength = forceStrength;
        this.reset();
    }

    reset() {
        this.dampening = 0.01;
        this.maxVelocity = 2.0;
        this.maxDistance = 50;
        this.delta = new THREE.Vector3();

        this.nodes.forEach(node => {
            node.location = new THREE.Vector3(Math.random(), Math.random(), Math.random());
            node.force = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        });
    }

    run() {
        for (let i = 0; i < this.iterations; i += 1) {
            setTimeout(this.iterate.bind(this), 3 * i);
        }
    }

    iterate() {
        this.dampening -= 0.01 / this.iterations;

        // Add in Coulomb-esque node-node repulsive forces
        for (let j = 0; j < this.nodes.length; j += 1) {
            for (let k = 0; k < this.nodes.length; k += 1) {
                if (j === k) {
                    continue;
                }
                let n1 = this.nodes[j];
                let n2 = this.nodes[k];

                this.delta.subVectors(n2.position, n1.position);
                let mag = this.delta.length();
                if (mag < 0.1) {
                    this.delta.set(Math.random(), Math.random(), Math.random()).multiplyScalar(0.1).addScalar(0.1);
                    mag = this.delta.length();
                }
                if (mag < this.maxDistance) {
                    this.delta.multiplyScalar(this.forceStrength ** 2 / mag ** 2);
                    n1.force.sub(this.delta.clone().multiplyScalar(n2.scale.x));
                    n2.force.add(this.delta.clone().multiplyScalar(n1.scale.x));
                }
            }
        }

        // Add Hooke-esque edge spring forces
        for (let j = 0; j < this.edges.length; j += 1) {
            let n1 = this.nodes[this.nodeNameToPosition[this.edges[j].src]];
            let n2 = this.nodes[this.nodeNameToPosition[this.edges[j].dst]];

            this.delta.subVectors(n2.position, n1.position);
            let mag = this.delta.length();
            if (mag < 0.1) {
                this.delta.set(THREE.Math.randFloat(0.1, 0.2), THREE.Math.randFloat(0.1, 0.2), THREE.Math.randFloat(0.1, 0.2));
                mag = this.delta.length();
            }
            mag = Math.min(mag, this.maxDistance);
            this.delta.multiplyScalar((mag ** 2 - this.forceStrength ** 2) / (mag * this.forceStrength));
            this.delta.multiplyScalar(this.edges[j].size);
            n1.force.add(this.delta.clone().multiplyScalar(n2.scale.x));
            n2.force.sub(this.delta.clone().multiplyScalar(n1.scale.x));
        }

        // Move by resultant force
        for (let j = 0; j < this.nodes.length; j += 1) {
            let n1 = this.nodes[j];
            n1.force.multiplyScalar(this.dampening);
            n1.force.setX(THREE.Math.clamp(n1.force.x, -this.maxVelocity, this.maxVelocity));
            n1.force.setY(THREE.Math.clamp(n1.force.y, -this.maxVelocity, this.maxVelocity));
            n1.force.setZ(THREE.Math.clamp(n1.force.z, -this.maxVelocity, this.maxVelocity));

            n1.position.add(n1.force);
            n1.force.set(0, 0, 0);
        }
        for (let j = 0; j < this.edges.length; j += 1) {
            let e = this.edges[j];
            let n1 = this.nodes[this.nodeNameToPosition[e.src]];
            let n2 = this.nodes[this.nodeNameToPosition[e.dst]];
            let mag = n2.position.distanceTo(n1.position);
            e.position.addVectors(n1.position, n2.position).divideScalar(2.0);
            e.lookAt(n2.position);
            e.scale.z = mag;
            if (this.directed) {
                let a = this.arrows[j];
                a.position.copy(e.position);
                a.lookAt(n2.position);
            }
        }
    }
}