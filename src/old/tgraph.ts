import {Mesh, WebGLRenderer, PerspectiveCamera, HemisphereLight, DirectionalLight, SphereGeometry, CylinderGeometry, Scene, Matrix4, Euler, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Color, Vector2, Raycaster} from 'three';
import * as TrackballControls from "three-trackballcontrols";
import * as $ from "jquery";

import { GraphOptions } from "./GraphOptions";
import { Optimizer } from "./optimizer";
import { makeMaterial, extend } from "../utils";
import { nodesMeshCollection, verticesMeshCollection, arrowsMeshCollection, NodeMesh, GraphData, GraphMeshes } from './types';
import { Node, Vertex } from "../types/GraphComponents";

export class GraphView<T, U> {
    $s: JQuery<HTMLElement>;
    options: GraphOptions<T>;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    controls: TrackballControls;
    light: HemisphereLight;
    directionalLight: DirectionalLight;

    sphereGeometry: SphereGeometry;
    cylinderGeometry: CylinderGeometry;
    coneGeometry: CylinderGeometry;
    scene: Scene;

    nodes: nodesMeshCollection<T> = {};
    edges: verticesMeshCollection<U> = [];
    arrows: arrowsMeshCollection<U> = [];
    directed: boolean = true;

    nodeNameToPosition: Map<string, number> = new Map<string, number>();
    selectedNode: NodeMesh<T> | undefined = undefined;



    constructor(s: HTMLElement, options: GraphOptions<T>) {
        this.$s = $(s);
        this.options = options;
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.$s.width() || 0, this.$s.height() || 1);
        this.$s.append(this.renderer.domElement);

        this.camera = new PerspectiveCamera(70, (this.$s.width() || 0) / (this.$s.height() || 1));
        this.camera.position.setZ(this.options.z);
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = this.options.rotateSpeed;

        // GEOMETRY
        this.sphereGeometry = new SphereGeometry(this.options.nodeSize, 16, 12);
        this.cylinderGeometry = new CylinderGeometry(this.options.edgeSize, this.options.edgeSize, 1, 32, 3, false);
        this.coneGeometry = new CylinderGeometry(this.options.edgeSize, this.options.arrowSize, 2 * this.options.arrowSize, 32, 3, false);

        // This orients the cylinder primitive so lookAt() works properly
        let matrix = new Matrix4().makeRotationFromEuler(new Euler(Math.PI / 2, Math.PI, 0));
        this.cylinderGeometry.applyMatrix(matrix);
        this.coneGeometry.applyMatrix(matrix);

        this.light = new HemisphereLight(0xffffff, 0.5);
        this.directionalLight = new DirectionalLight(0xffffff, 0.5);
        this.directionalLight.position.set(1, 1, 1);

        this.scene = new Scene();
        this.scene.add(this.camera);
        this.camera.add(this.light);
        this.camera.add(this.directionalLight);


        $(window).resize(this.onResize.bind(this));

        if (this.options.showSave) {
            this.showSave();
        }

        if (this.options.clickableNodes) {
            this.$s.click(this.onNodeClick.bind(this))
        }

        if (this.options.hoverableNodes) {
            this.$s.mousemove(this.onNodeHover.bind(this))
        }

        this.animate();
    }

    onResize() {
        this.renderer.setSize(this.$s.width() || 0, this.$s.height() || 1);
        this.camera.aspect = (this.$s.width() || 0) / (this.$s.height() || 1);
        this.camera.updateProjectionMatrix();
    }

    onNodeClick(event: any) {
        let intersects = this.cursorIntersects(event);
        if (intersects.length !== 0) {
            this.options.onNodeClickAction(intersects[0].object);
        }
    }

    onNodeHover(event: any) {
        let intersects = this.cursorIntersects(event);
        if (intersects.length === 0) {
            if (this.selectedNode !== undefined) {
                this.unselectNode();
            }
        } else {
            // Move from empty to node
            if (this.selectedNode === undefined) {
                this.selectNode(<NodeMesh<T>>intersects[0].object)
                // Move between nodes
            } else if (this.selectedNode !== intersects[0].object) {
                this.unselectNode();
                this.selectNode(<NodeMesh<T>>intersects[0].object);
            }
        }
    }

    unselectNode() {
        if (this.selectedNode !== undefined) {
            let material = this.selectedNode.material;
            if (material instanceof MeshBasicMaterial ||
                material instanceof MeshLambertMaterial ||
                material instanceof MeshPhongMaterial) {
                console.log(this.selectedNode.material)
                material.color = new Color(parseInt(this.selectedNode.color, 16));
                material.needsUpdate = true;
                console.log(this.selectedNode.material)
            }
            this.options.onExitHover(this.selectedNode);
        }
        this.selectedNode = undefined;
    }

    selectNode(node: NodeMesh<T>) {
        this.selectedNode = node;
        let material = this.selectedNode.material;
        if (material instanceof MeshBasicMaterial ||
            material instanceof MeshLambertMaterial ||
            material instanceof MeshPhongMaterial) {
            material.color = new Color(parseInt(this.selectedNode.hoverColor, 16));
            material.needsUpdate = true;
        }
        this.options.onEnterHover(this.selectedNode);
    }


    cursorIntersects(event: any) {
        let mouse = new Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        let raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        let intersects = raycaster.intersectObjects(Object.values(this.nodes));
        return intersects
    }

    drawNode(node: Node<T>, id: string) {
        let material = makeMaterial(node.color, this.options.shaderType);
        let mesh = new Mesh(this.sphereGeometry, material);
        mesh.name = node.name;
        mesh.position.set(node.location.x, node.location.y, node.location.z);
        mesh.scale.set(node.size, node.size, node.size);
        this.scene.add(mesh);
        this.nodes[id] = extend(node, mesh);
    }

    drawEdge(edge: Vertex<U>) {
        let srcNode = this.nodes[this.nodeNameToPosition.get(edge.src)];
        let dstNode = this.nodes[this.nodeNameToPosition.get(edge.dst)];
        let material = makeMaterial(edge.color, this.options.shaderType);
        let mesh = new Mesh(this.cylinderGeometry, material);
        mesh.position.addVectors(srcNode.position, dstNode.position).divideScalar(2.0);
        mesh.lookAt(dstNode.position);
        mesh.scale.set(edge.size, edge.size, dstNode.position.distanceTo(srcNode.position));

        // Save array-index references to nodes, mapping from object structure
        this.scene.add(mesh);
        this.edges.push(extend(edge, mesh));

        if (this.directed) {
            let arrow = new Mesh(this.coneGeometry, material);
            arrow.position.copy(mesh.position);
            arrow.lookAt(dstNode.position);
            let size = Math.sqrt(edge.size);
            arrow.scale.set(size, size, size);
            this.scene.add(arrow);
            this.arrows.push(extend(edge, arrow));
        }
    }


    draw(graph: GraphData<T, U>) {
        this.directed = graph.isDirected;

        for (let id in graph.nodes) {
            this.drawNode(graph.nodes[id], id);
        }
        graph.vertices.forEach(edge => this.drawEdge(edge));

        if (this.options.runOptimization) {
            this.optimize();
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    optimize() {
        let gm = {nodes: this.nodes, vertices: this.edges,  arrows: this.arrows};
        let optimizer = new Optimizer(gm);
        optimizer.run();
    }

    showSave() {
        let saveButton = document.createElement("button");
        saveButton.className = "jgraph-save";
        saveButton.style.position = "absolute";
        saveButton.style.zIndex = "10";
        saveButton.innerHTML = "Save";
        this.$s.find('.jgraph-save').click(this.save);
    }

    save() {
        let renderWidth = 2560 / (window.devicePixelRatio || 1);
        let w = this.$s.width() || 1;
        let h = this.$s.height() || 0;
        this.renderer.setSize(renderWidth, renderWidth * h / w);
        this.renderer.render(this.scene, this.camera);
        let link = document.createElement('a');
        link.download = 'tgraph.png';
        link.href = this.renderer.domElement.toDataURL('image/png');
        link.click();
        this.renderer.setSize(w, h);
    }

}

