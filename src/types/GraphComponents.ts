import { Vector3, Mesh } from 'three';
import CONSTS from '../const';
import { randomVector3 } from '../utils';
import { MeshParameters } from './MeshParameters';

export interface IGraphComponent<T> {
    label: string,
    data: T,
    opt: MeshParameters<IGraphComponent<T>>
}

export class Node<DataType> extends Mesh implements IGraphComponent<DataType> {
    constructor(name: string, label: string, data: DataType, opt: MeshParameters<Node<DataType>>) {
        super(CONSTS.geometry.sphere(opt.size), opt.material);
        this.scale.set(opt.size, opt.size, opt.size);
        let randPos = randomVector3();
        this.position.set(randPos.x, randPos.y, randPos.z);
        this.name = name;
        this.label = label;
        this.data = data;
        this.force = randomVector3();
        this.opt = opt;
    }
    name: string;
    label: string;
    force: Vector3; //TODO Delete
    data: DataType;
    opt: MeshParameters<Node<DataType>>;
}

export class Vertex<DataType> extends Mesh implements IGraphComponent<DataType> {
    constructor(src: string, dst: string, label: string, data: DataType, directed: Boolean, opt: MeshParameters<Vertex<DataType>>) {
        super(CONSTS.geometry.cylinder(opt.size), opt.material);
        this.scale.set(opt.size, opt.size, opt.size);
        this.src = src;
        this.dst = dst;
        this.label = label;
        this.data = data;
        this.opt = opt;
        if (directed){
            this.arrow = new Mesh(CONSTS.geometry.cone(opt.size, opt.size), opt.material);

            let size = Math.sqrt(opt.size);
            this.arrow.scale.set(size, size, size);
        }
    }
    label: string;
    src: string;
    dst: string;
    data: DataType;
    opt: MeshParameters<Vertex<DataType>>;
    arrow: Mesh | undefined;
};

export type GraphElement = Node<any> | Vertex<any>;