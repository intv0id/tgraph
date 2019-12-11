import { Vector3, Mesh } from 'three';
import CONSTS from '../const';
import { randomVector3 } from '../utils';
import { MeshParameters } from './MeshParameters';
export class Node<DataType> extends Mesh {
    constructor(name: string, label: string, data: DataType, opt: MeshParameters<Node<DataType>>) {
        super(CONSTS.geometry.sphere, opt.material);
        this.scale.set(opt.size, opt.size, opt.size);
        this.name = name;
        this.label = label;
        this.data = data;
        this.size = opt.size;
        this.location = randomVector3();
        this.force = randomVector3();
    }
    name: string;
    color: string;
    hoverColor: string;
    label: string;
    size: number;
    location: Vector3;
    force: Vector3;
    data: DataType;
}
export class Vertex<DataType> extends Mesh {
    constructor(src: string, dst: string, label: string, data: DataType, directed: Boolean, opt: MeshParameters<Vertex<DataType>>) {
        super(CONSTS.geometry.cylinder, opt.material);

        //this.position.set(node.location.x, node.location.y, node.location.z); TODO Draw
        this.scale.set(opt.size, opt.size, opt.size);
        this.src = src;
        this.dst = dst;
        this.label = label;
        this.data = data;
        this.opt = opt;
        if (directed){
            this.arrow = new Mesh(CONSTS.geometry.cylinder, opt.material);

            let size = Math.sqrt(edge.size);
            this.arrow.scale.set(size, size, size);
        }
    }
    label: string;
    src: string;
    dst: string;
    data: DataType;
    opt: MeshParameters<Vertex<DataType>>;
    arrow: Mesh | undefined;
}
export type nodesCollection<T> = {
    [id: string]: Node<T>;
};
export type verticesCollection<T> = Vertex<T>[];
