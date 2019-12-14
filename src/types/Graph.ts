import { Vector3, Math as ThreeMath } from 'three';
import { Node, Vertex } from './GraphComponents';
import { randomVector3 } from '../utils';

export class Graph<NodeDataType, VertexDataType> {
    constructor(nodes: Map<string, Node<NodeDataType>>, vertices: Vertex<VertexDataType>[]) {
        this.nodes = nodes;
        this.vertices = vertices;
    }
    /**
     * Add in Coulomb-esque node-node repulsive forces
     */
    coulombEsqueForce(delta: Vector3, forceStrength: number, maxDistance: number) {
        this.nodes.forEach((n1, k1, m1) => {
            this.nodes.forEach((n2, k2, m2) => {
                if (k1 === k2) {
                    return;
                }

                delta.subVectors(n2.position, n1.position);
                let mag = delta.length();
                if (mag < 0.1) {
                    delta = randomVector3().multiplyScalar(0.1).addScalar(0.1);
                    mag = delta.length();
                }
                if (mag < maxDistance) {
                    delta.multiplyScalar(forceStrength ** 2 / mag ** 2);
                    n1.force.sub(delta.clone().multiplyScalar(n2.scale.x));
                    n2.force.add(delta.clone().multiplyScalar(n1.scale.x));
                }
            });
        });
    }

    /**
     * Add Hooke-esque edge spring forces
     */
    hookeEsqueForce(delta: Vector3, maxDistance: number, forceStrength: number) {
        this.vertices.forEach((edge, idx, arr) => {

            let src = this.nodes.get(edge.src);
            let dst = this.nodes.get(edge.dst);
            if (src === undefined) {
                console.error(`Source node ${edge.src} not found`);
                return;
            }
            else if (dst === undefined) {
                console.error(`Destination node ${edge.dst} not found`);
                return;
            }
            delta.subVectors(dst.position, src.position);
            let mag = delta.length();
            if (mag < 0.1) {
                delta.set(ThreeMath.randFloat(0.1, 0.2), ThreeMath.randFloat(0.1, 0.2), ThreeMath.randFloat(0.1, 0.2));
                mag = delta.length();
            }
            mag = Math.min(mag, maxDistance);
            delta.multiplyScalar((mag ** 2 - forceStrength ** 2) / (mag * forceStrength));
            delta.multiplyScalar(edge.scale.x); //TODO previously edge.size
            src.force.add(delta.clone().multiplyScalar(dst.scale.x));
            dst.force.sub(delta.clone().multiplyScalar(src.scale.x));
        });
    }

    moveEdges(dampening: number, maxVelocity: number) {
        this.nodes.forEach((n, k, m) => {
            n.force.multiplyScalar(dampening);
            n.force.setX(ThreeMath.clamp(n.force.x, -maxVelocity, maxVelocity));
            n.force.setY(ThreeMath.clamp(n.force.y, -maxVelocity, maxVelocity));
            n.force.setZ(ThreeMath.clamp(n.force.z, -maxVelocity, maxVelocity));
            n.position.add(n.force);
            n.force.set(0, 0, 0);
        });
    }

    moveVertices() {
        this.vertices.forEach((edge, idx, arr) => {
            let src = this.nodes.get(edge.src);
            let dst = this.nodes.get(edge.dst);
            if (src === undefined) {
                console.error(`Source node ${edge.src} not found`);
                return;
            }
            else if (dst === undefined) {
                console.error(`Destination node ${edge.dst} not found`);
                return;
            }
            let mag = dst.position.distanceTo(src.position);
            edge.position.addVectors(src.position, dst.position).divideScalar(2.0);
            edge.lookAt(dst.position);
            edge.scale.z = mag;
            if (edge.arrow) {
                edge.arrow.position.copy(dst.position);
                edge.arrow.lookAt(dst.position);
            }
        });
    }

    optimize(iterations: number = 10, forceStrength: number = 10, dampening: number = 0.01, maxVelocity: number = 2.0, maxDistance: number = 50, delta: Vector3 = new Vector3()) {
        let frameIteration = () => {
            dampening -= 0.01 / iterations;

            // Compute forces
            this.coulombEsqueForce(delta, forceStrength, maxDistance);
            this.hookeEsqueForce(delta, maxDistance, forceStrength);

            // Move by resultant force
            this.moveEdges(dampening, maxVelocity);
            this.moveVertices();
        };

        for (let i = 0; i < iterations; i += 1) {
            setTimeout(frameIteration.bind(this), 3 * i);
        }
    }
    nodes: Map<string, Node<NodeDataType>>;
    vertices: Vertex<VertexDataType>[];
}
