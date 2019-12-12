import { Vector3, Math as ThreeMath } from 'three';
import { Node, Vertex } from './GraphComponents';

export class Graph<NodeDataType, VerticeDataType> {
    constructor(nodes: Map<string,Node<NodeDataType>>, vertices: Vertex<VerticeDataType>[]) {
        this.nodes = nodes;
        this.vertices = vertices;
    }
    optimize(iterations: number = 10000, forceStrength: number = 10, dampening: number = 0.01, maxVelocity: number = 2.0, maxDistance: number = 50, delta: Vector3 = new Vector3()) {
        let frameIteration = () => {
            dampening -= 0.01 / iterations;
            // Add in Coulomb-esque node-node repulsive forces
            for (let k1 in this.nodes) {
                for (let k2 in this.nodes) {
                    if (k1 === k2) {
                        continue;
                    }
                    let n1 = this.nodes[k1];
                    let n2 = this.nodes[k2];
                    delta.subVectors(n2.position, n1.position);
                    let mag = delta.length();
                    if (mag < 0.1) {
                        delta.set(Math.random(), Math.random(), Math.random()).multiplyScalar(0.1).addScalar(0.1);
                        mag = delta.length();
                    }
                    if (mag < maxDistance) {
                        delta.multiplyScalar(forceStrength ** 2 / mag ** 2);
                        n1.force.sub(delta.clone().multiplyScalar(n2.scale.x));
                        n2.force.add(delta.clone().multiplyScalar(n1.scale.x));
                    }
                }
            }
            // Add Hooke-esque edge spring forces
            for (let edge of this.vertices) {
                let src = this.nodes[edge.src];
                let dst = this.nodes[edge.dst];
                if (src === undefined) {
                    console.error(`Source node ${edge.src} not found`);
                    continue;
                }
                else if (dst === undefined) {
                    console.error(`Destination node ${edge.dst} not found`);
                    continue;
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
            }
            // Move by resultant force
            for (let k in this.nodes) {
                let n = this.nodes[k];
                n.force.multiplyScalar(dampening);
                n.force.setX(ThreeMath.clamp(n.force.x, -maxVelocity, maxVelocity));
                n.force.setY(ThreeMath.clamp(n.force.y, -maxVelocity, maxVelocity));
                n.force.setZ(ThreeMath.clamp(n.force.z, -maxVelocity, maxVelocity));
                n.position.add(n.force);
                n.force.set(0, 0, 0);
            }
            for (let edge of this.vertices) {
                let src = this.nodes[edge.src];
                let dst = this.nodes[edge.dst];
                if (src === undefined) {
                    console.error(`Source node ${edge.src} not found`);
                    continue;
                }
                else if (dst === undefined) {
                    console.error(`Destination node ${edge.dst} not found`);
                    continue;
                }
                let mag = dst.position.distanceTo(src.position);
                edge.position.addVectors(src.position, dst.position).divideScalar(2.0);
                edge.lookAt(dst.position);
                edge.scale.z = mag;
                if (edge.arrow) {
                    edge.arrow.position.copy(dst.position);
                    edge.arrow.lookAt(dst.position);
                }
            }
        };
        for (let i = 0; i < iterations; i += 1) {
            setTimeout(frameIteration.bind(this), 3 * i);
        }
    }
    nodes: Map<string, Node<NodeDataType>>;
    vertices: Vertex<VerticeDataType>[];
}
