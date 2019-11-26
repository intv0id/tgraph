import * as THREE from 'three';

import {Vector3} from 'three';

import { GraphMeshes,  arrowsMeshCollection, nodesMeshCollection, verticesMeshCollection, GraphData } from "./types";
import { randomVector3 } from './utils';


export class Optimizer {
    graphData: GraphData



    nodes: nodesMeshCollection;
    edges: verticesMeshCollection;
    arrows: arrowsMeshCollection;
    directed: boolean;
    nodeNameToPosition: Map<string, number>;
    iterations: number;
    forceStrength: number;
    dampening: number = 0;
    maxVelocity: number = 0;
    maxDistance: number = 0;
    delta: THREE.Vector3 =  new Vector3();

    constructor(gm: GraphMeshes, iterations: number = 10000, forceStrength: number = 10.0) {
        this.nodes = gm.nodes;
        this.edges = gm.vertices;
        this.arrows = gm.arrows;
        this.iterations = iterations;
        this.forceStrength = forceStrength;
        this.reset();
    }

    reset() {
        this.dampening = 0.01;
        this.maxVelocity = 2.0;
        this.maxDistance = 50;
        this.delta = new Vector3();

        for (const nodeKey in this.nodes) {
            let node = this.nodes[nodeKey];
            node.location = randomVector3();
            node.force = randomVector3();
        }
    }

    run() {
        for (let i = 0; i < this.iterations; i += 1) {
            setTimeout(this.iterate.bind(this), 3 * i);
        }
    }

    iterate() {
        this.dampening -= 0.01 / this.iterations;

        // Add in Coulomb-esque node-node repulsive forces
        for(let k1 in this.nodes) {
            for (let k2 in this.nodes) {
                if (k1 === k2) {
                    continue;
                }
                let n1 = this.nodes[k1];
                let n2 = this.nodes[k2];

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
        for (let edge of this.edges) {
            let src = this.nodes[edge.src];
            let dst = this.nodes[edge.dst];
            if (src === undefined) {
                console.error(`Source node ${edge.src} not found`);
                continue;
            } else if (dst === undefined) {
                console.error(`Destination node ${edge.dst} not found`);
                continue;
            }

            this.delta.subVectors(dst.position, src.position);
            let mag = this.delta.length();
            if (mag < 0.1) {
                this.delta.set(THREE.Math.randFloat(0.1, 0.2), THREE.Math.randFloat(0.1, 0.2), THREE.Math.randFloat(0.1, 0.2));
                mag = this.delta.length();
            }
            mag = Math.min(mag, this.maxDistance);
            this.delta.multiplyScalar((mag ** 2 - this.forceStrength ** 2) / (mag * this.forceStrength));
            this.delta.multiplyScalar(edge.size);
            src.force.add(this.delta.clone().multiplyScalar(dst.scale.x));
            dst.force.sub(this.delta.clone().multiplyScalar(src.scale.x));
        }

        // Move by resultant force
        for(let k in this.nodes) {
            let n = this.nodes[k];
            n.force.multiplyScalar(this.dampening);
            n.force.setX(THREE.Math.clamp(n.force.x, -this.maxVelocity, this.maxVelocity));
            n.force.setY(THREE.Math.clamp(n.force.y, -this.maxVelocity, this.maxVelocity));
            n.force.setZ(THREE.Math.clamp(n.force.z, -this.maxVelocity, this.maxVelocity));

            n.position.add(n.force);
            n.force.set(0, 0, 0);
        }
        for (let edge of this.edges) {
            let src = this.nodes[edge.src];
            let dst = this.nodes[edge.dst];
            if (src === undefined) {
                console.error(`Source node ${edge.src} not found`);
                continue;
            } else if (dst === undefined) {
                console.error(`Destination node ${edge.dst} not found`);
                continue;
            }

            let mag = dst.position.distanceTo(src.position);
            edge.position.addVectors(src.position, dst.position).divideScalar(2.0);
            edge.lookAt(dst.position);
            edge.scale.z = mag;
        }

        for ( let arrow of this.arrows ){
            let dst = this.nodes[arrow.dst];
            arrow.position.copy(dst.position);
            arrow.lookAt(dst.position);
        }
    }
}