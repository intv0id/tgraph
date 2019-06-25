/// <reference types="jquery" />
import * as THREE from 'three';
import * as TrackballControls from "three-trackballcontrols";
import { NodeMesh, EdgeMesh, ArrowMesh, GraphEdge, GraphNode, Graph, GraphOptions } from "./graphTypes";
export declare class GraphView {
    $s: JQuery<HTMLElement>;
    options: GraphOptions;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: TrackballControls;
    light: THREE.HemisphereLight;
    directionalLight: THREE.DirectionalLight;
    sphereGeometry: THREE.SphereGeometry;
    cylinderGeometry: THREE.CylinderGeometry;
    coneGeometry: THREE.CylinderGeometry;
    scene: THREE.Scene;
    nodes: NodeMesh[];
    edges: EdgeMesh[];
    arrows: ArrowMesh[];
    directed: boolean;
    nodeNameToPosition: Map<string, number>;
    selectedNode: NodeMesh | undefined;
    constructor(selector: JQuery.Selector, options: GraphOptions);
    onResize(): void;
    onNodeClick(event: any): void;
    onNodeHover(event: any): void;
    unselectNode(): void;
    selectNode(node: NodeMesh): void;
    cursorIntersects(event: any): THREE.Intersection[];
    drawNode(node: GraphNode): void;
    drawEdge(edge: GraphEdge): void;
    draw(graph: Graph): void;
    animate(): void;
    optimize(): void;
    showSave(): void;
    save(): void;
}
