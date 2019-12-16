import * as React from 'react';
import { Component } from 'react';
import { Guid } from "guid-typescript";
import { Graph } from '../types/Graph';
import { GraphParameters } from '../types/GraphParameters';
import { Node, Vertex, GraphElement } from '../types/GraphComponents';
import { Scene, HemisphereLight, DirectionalLight, Camera, PerspectiveCamera, WebGLRenderer, Vector2, Raycaster, Intersection } from 'three';
import * as TrackballControls from "three-trackballcontrols";

export interface IGraphCanvasProps<NodeDataType, VertexDataType> {
    graphData: Graph<NodeDataType, VertexDataType>,
    graphParams: GraphParameters
};
export interface IGraphCanvasState { };

export default class GraphCanvas<NodeDataType, VertexDataType> extends Component<IGraphCanvasProps<NodeDataType, VertexDataType>, IGraphCanvasState> {

    constructor(props) {
        super(props);

        this.state = { canvasSize: new Vector2() };

        this.componentId = `Graph${Guid.create().toString()}`;

        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });

        this.light = new HemisphereLight(0xffffff, 0.5);
        this.directionalLight = new DirectionalLight(0xffffff, 0.5);
        this.directionalLight.position.set(1, 1, 1);

        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.designScene();
            this.undraw();
            this.draw();
        });
    }

    drawNode(node: Node<NodeDataType>, id: string) {
        this.scene.add(node);
    }

    drawEdge(edge: Vertex<VertexDataType>) {
        this.scene.add(edge);

        if (edge.arrow) {
            this.scene.add(edge.arrow);
        }
    }

    setCanvasSize() {
        let htmlElement = document.getElementById(this.componentId);
        this.canvasSize = new Vector2(htmlElement.clientWidth, htmlElement.clientHeight);
    }

    designScene() {
        this.renderer.setSize(this.canvasSize.x, this.canvasSize.y);

        this.camera = new PerspectiveCamera(70, this.canvasSize.x / this.canvasSize.y);
        this.camera.position.setZ(this.props.graphParams.cameraZ);

        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = this.props.graphParams.rotateSpeed;

        this.camera.add(this.light);
        this.camera.add(this.directionalLight);

        this.scene = new Scene();
        this.scene.autoUpdate = true;
        this.scene.add(this.camera);
    }

    draw() {
        this.props.graphData.nodes.forEach(
            (value, key, map) => this.drawNode(value, key)
        );

        this.props.graphData.vertices.forEach(edge => this.drawEdge(edge));
    }

    undraw() {
        this.scene.children = [this.camera];
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        if (this.props.graphParams.runOptimization) {
            this.props.graphData.optimize();
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onClick(event: MouseEvent) {

        let intersects: Intersection[] = this.cursorIntersects(event);
        if (intersects.length !== 0) {
            let element = intersects[0].object as GraphElement;
            element.opt.onClickAction(element);
        }
    }

    onMouseMove(event: MouseEvent) {
        let intersects: Intersection[] = this.cursorIntersects(event);
        if (intersects.length === 0) {
            if (this.selectedElement !== undefined) {
                this.unselectElement();
            }
        } else {
            if (this.selectedElement === undefined) {
                this.selectElement(intersects[0].object as GraphElement)
            } else if (this.selectedElement !== (intersects[0].object as GraphElement)) {
                this.unselectElement();
                this.selectElement(intersects[0].object as GraphElement);
            }
        }
    }

    unselectElement() {
        if (this.selectedElement !== undefined) {
            let element = this.selectedElement;
            element.material = element.opt.material;
            element.material.needsUpdate = true;
            element.opt.onExitHover(element);
        }
        this.selectedElement = undefined;
    }

    selectElement(element: GraphElement) {
        element.material = element.opt.hoverMaterial;
        element.material.needsUpdate = true;
        this.selectedElement = element;
        element.opt.onEnterHover(element);
    }


    cursorIntersects(event: MouseEvent) {
        let mouse = new Vector2();
        let domElt = this.renderer.domElement;
        mouse.x = (event.clientX - domElt.offsetLeft) / domElt.width * 2 - 1;
        mouse.y = - (event.clientY - domElt.offsetTop) / domElt.height * 2 + 1;

        let raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        let intersects = raycaster.intersectObjects(
            (Array.from(this.props.graphData.nodes.values()) as GraphElement[]).concat(
                this.props.graphData.vertices
            )
        );
        return intersects;
    }

    componentDidUpdate() {
        this.undraw();
        this.draw();
    }

    componentDidMount() {
        document.getElementById(this.componentId).append(this.renderer.domElement);
        this.setCanvasSize();
        this.designScene();
        this.draw();
        this.animate();
    }

    componentWillUnmount() {
        this.renderer.domElement.remove();
    }

    save() {
        let link = document.createElement('a');
        link.download = 'tgraph.png';
        link.href = this.renderer.domElement.toDataURL('image/png');
        link.click();
    }

    render() {
        return <div
            className="graphCanvas"
            id={this.componentId}
            onClick={this.onClick.bind(this)}
            onMouseMove={this.onMouseMove.bind(this)}
        >
        </div>;
    }

    light: HemisphereLight;
    directionalLight: DirectionalLight;
    renderer: WebGLRenderer | undefined;
    scene: Scene | undefined;
    camera: Camera | undefined;
    controls: TrackballControls | undefined;
    componentId: string | undefined;
    selectedElement: GraphElement | undefined = undefined;
    canvasSize: Vector2;
}


