import * as THREE from 'three';
import * as TrackballControls from "three-trackballcontrols";
import * as $ from "jquery";

import { NodeMesh, EdgeMesh, ArrowMesh, GraphEdge, GraphNode, Graph, GraphOptions } from "./graphTypes";
import { Optimizer } from "./optimizer";
import { makeMaterial, extend } from "./utils";

export class GraphView {
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

    nodes: NodeMesh[] = [];
    edges: EdgeMesh[] = [];
    arrows: ArrowMesh[] = [];
    directed: boolean = true;

    nodeNameToPosition: Map<string, number> = new Map<string, number>();
    selectedNode: NodeMesh | undefined = undefined;



    constructor(selector: JQuery.Selector, options: GraphOptions) {
        this.$s = $(selector);
        this.options = options;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.$s.width() || 0, this.$s.height() || 1);
        this.$s.append(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, (this.$s.width() || 0) / (this.$s.height() || 1));
        this.camera.position.setZ(this.options.z);
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = this.options.rotateSpeed;

        // GEOMETRY
        this.sphereGeometry = new THREE.SphereGeometry(this.options.nodeSize, 16, 12);
        this.cylinderGeometry = new THREE.CylinderGeometry(this.options.edgeSize, this.options.edgeSize, 1, 32, 3, false);
        this.coneGeometry = new THREE.CylinderGeometry(this.options.edgeSize, this.options.arrowSize, 2 * this.options.arrowSize, 32, 3, false);

        // This orients the cylinder primitive so THREE.lookAt() works properly
        let matrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI / 2, Math.PI, 0));
        this.cylinderGeometry.applyMatrix(matrix);
        this.coneGeometry.applyMatrix(matrix);

        this.light = new THREE.HemisphereLight(0xffffff, 0.5);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.directionalLight.position.set(1, 1, 1);

        this.scene = new THREE.Scene();
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
                this.selectNode(<NodeMesh>intersects[0].object)
                // Move between nodes
            } else if (this.selectedNode !== intersects[0].object) {
                this.unselectNode();
                this.selectNode(<NodeMesh>intersects[0].object);
            }
        }
    }

    unselectNode() {
        if (this.selectedNode !== undefined) {
            let material = this.selectedNode.material;
            if (material instanceof THREE.MeshBasicMaterial ||
                material instanceof THREE.MeshLambertMaterial ||
                material instanceof THREE.MeshPhongMaterial) {
                console.log(this.selectedNode.material)
                material.color = new THREE.Color(parseInt(this.selectedNode.color, 16));
                material.needsUpdate = true;
                console.log(this.selectedNode.material)
            }
            this.options.onExitHover(this.selectedNode);
        }
        this.selectedNode = undefined;
    }

    selectNode(node: NodeMesh) {
        this.selectedNode = node;
        let material = this.selectedNode.material;
        if (material instanceof THREE.MeshBasicMaterial ||
            material instanceof THREE.MeshLambertMaterial ||
            material instanceof THREE.MeshPhongMaterial) {
            material.color = new THREE.Color(parseInt(this.selectedNode.hoverColor, 16));
            material.needsUpdate = true;
        }
        this.options.onEnterHover(this.selectedNode);
    }


    cursorIntersects(event: any) {
        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        let intersects = raycaster.intersectObjects(this.nodes);
        return intersects
    }

    drawNode(node: GraphNode) {
        let material = makeMaterial(node.color, this.options.shader);
        let mesh = new THREE.Mesh(this.sphereGeometry, material);
        mesh.name = node.name;
        mesh.position.set(node.location.x, node.location.y, node.location.z);
        mesh.scale.set(node.size, node.size, node.size);
        this.scene.add(mesh);
        this.nodeNameToPosition.set(node.name, this.nodes.length);
        this.nodes.push(extend(node, mesh));
    }

    drawEdge(edge: GraphEdge) {
        let srcNode = this.nodes[this.nodeNameToPosition.get(edge.src)];
        let dstNode = this.nodes[this.nodeNameToPosition.get(edge.dst)];
        let material = makeMaterial(edge.color, this.options.shader);
        let mesh = new THREE.Mesh(this.cylinderGeometry, material);
        mesh.position.addVectors(srcNode.position, dstNode.position).divideScalar(2.0);
        mesh.lookAt(dstNode.position);
        mesh.scale.set(edge.size, edge.size, dstNode.position.distanceTo(srcNode.position));

        // Save array-index references to nodes, mapping from object structure
        this.scene.add(mesh);
        this.edges.push(extend(edge, mesh));

        if (this.directed) {
            let arrow = new THREE.Mesh(this.coneGeometry, material);
            arrow.position.copy(mesh.position);
            arrow.lookAt(dstNode.position);
            let size = Math.sqrt(edge.size);
            arrow.scale.set(size, size, size);
            this.scene.add(arrow);
            this.arrows.push(arrow);
        }
    }


    draw(graph: Graph) {
        this.directed = graph.directed;

        graph.nodes.forEach(node => this.drawNode(node));
        graph.edges.forEach(edge => this.drawEdge(edge));

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
        let optimizer = new Optimizer(this.nodes, this.edges, this.arrows, this.directed, this.nodeNameToPosition);
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

