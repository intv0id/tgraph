/// <reference types="jquery" />
import { WebGLRenderer, PerspectiveCamera, HemisphereLight, DirectionalLight, SphereGeometry, CylinderGeometry, Scene } from 'three';
import * as TrackballControls from "three-trackballcontrols";
import { GraphOptions } from "./graphTypes";
import { nodesMeshCollection, verticesMeshCollection, arrowsMeshCollection, NodeMesh, Node, Vertex, GraphData } from './types';
export declare class GraphView {
    $s: JQuery<HTMLElement>;
    options: GraphOptions;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    controls: TrackballControls;
    light: HemisphereLight;
    directionalLight: DirectionalLight;
    sphereGeometry: SphereGeometry;
    cylinderGeometry: CylinderGeometry;
    coneGeometry: CylinderGeometry;
    scene: Scene;
    nodes: nodesMeshCollection;
    edges: verticesMeshCollection;
    arrows: arrowsMeshCollection;
    directed: boolean;
    nodeNameToPosition: Map<string, number>;
    selectedNode: NodeMesh | undefined;
    constructor(selector: JQuery.Selector, options: GraphOptions);
    onResize(): void;
    onNodeClick(event: any): void;
    onNodeHover(event: any): void;
    unselectNode(): void;
    selectNode(node: NodeMesh): void;
    cursorIntersects(event: any): import("three").Intersection[];
    drawNode(node: Node, id: string): void;
    drawEdge(edge: Vertex): void;
    draw(graph: GraphData): void;
    animate(): void;
    optimize(): void;
    showSave(): void;
    save(): void;
}
