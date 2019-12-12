import * as React from 'react';
import { Component, useEffect } from 'react';
import { Guid } from "guid-typescript";
import { Graph } from '../types/Graph';
import { GraphParameters } from '../types/GraphParameters';
import { Node, Vertex } from '../types/GraphComponents';
import { Scene, HemisphereLight, DirectionalLight, Camera, PerspectiveCamera, WebGLRenderer } from 'three';
import * as TrackballControls from "three-trackballcontrols";

export interface GraphProps<NodeDataType, VertexDataType> { graphData: Graph<NodeDataType, VertexDataType>, graphParams: GraphParameters };
export interface GraphState { selectedNodeId?: string, selectedVerticeId?: string };

export default class GraphCanvas<NodeDataType, VertexDataType> extends Component<GraphProps<NodeDataType, VertexDataType>, GraphState> {

    readonly state: GraphState = { selectedNodeId: undefined, selectedVerticeId: undefined };

    drawNode(node: Node<NodeDataType>, id: string) {
        this.scene.add(node);
    }

    drawEdge(edge: Vertex<VertexDataType>) {
        let srcNode = this.props.graphData.nodes[edge.src];
        let dstNode = this.props.graphData.nodes[edge.dst];
        edge.position.addVectors(srcNode.position, dstNode.position).divideScalar(2.0);
        edge.scale.set(edge.opt.size, edge.opt.size, dstNode.position.distanceTo(srcNode.position));
        edge.lookAt(dstNode.position);

        this.scene.add(edge);

        if (edge.arrow) {
            edge.arrow.position.copy(edge.position);
            edge.arrow.lookAt(dstNode.position);
            this.scene.add(edge.arrow);
        }
    }

    draw(renderer: WebGLRenderer) {

        this.props.graphData.nodes.forEach(
            (value, key, map) => {
                console.log(value);
                this.drawNode(value, key) ;
            }
        );

        // Draw vertices
        this.props.graphData.vertices.forEach(edge => this.drawEdge(edge));

        // Spatial optimization
        if (this.props.graphParams.runOptimization) {
            this.props.graphData.optimize();
        }

        document.getElementById(this.componentId).append(renderer.domElement);
    }

    animate(renderer: WebGLRenderer, scene: Scene, camera: Camera, controls: TrackballControls) {
        window.requestAnimationFrame((() => this.animate(renderer, scene, camera, controls)).bind(this));
        controls.update();
        renderer.render(scene, camera);
    }

    onClick() {

    }

    onMouseMove() {

    }

    componentDidMount(){

        let light = new HemisphereLight(0xffffff, 0.5);
        let directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);

        let camera = new PerspectiveCamera(70, this.props.graphParams.width / this.props.graphParams.height);
        camera.position.setZ(this.props.graphParams.cameraZ);

        let controls = new TrackballControls(camera, this.renderer.domElement);
        controls.rotateSpeed = this.props.graphParams.rotateSpeed;

        camera.add(light);
        camera.add(directionalLight);

        this.scene = new Scene();
        this.scene.add(camera);

        this.animate(this.renderer, this.scene, camera, controls);

        this.draw(this.renderer);
        
    }

    render() {
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.props.graphParams.width, this.props.graphParams.height);

        this.componentId = `Graph${Guid.create().toString()}`;

        //TODO Resize & show save button

        const style = {
            width: `${this.props.graphParams.width}px`,
            height: `${this.props.graphParams.height}px`
        };

        return <div className="graphCanvas" id={this.componentId} onClick={this.onClick.bind(this)} onMouseMove={this.onMouseMove.bind(this)} style={style}></div>;
    }

    renderer: WebGLRenderer | undefined;
    scene: Scene | undefined;
    componentId: string | undefined;

}


