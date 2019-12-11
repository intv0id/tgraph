import * as React from 'react';
import { Component, useEffect } from 'react';
import { Guid } from "guid-typescript";
import { Graph } from '../types/Graph';
import { GraphParameters } from '../types/GraphParameters';
import { Node, Vertex } from '../types/GraphComponents';
import { Scene, HemisphereLight, DirectionalLight, Camera, PerspectiveCamera, WebGLRenderer } from 'three';
import * as TrackballControls from "three-trackballcontrols";




export interface GraphProps<NodeDataType, VertexDataType> { graphData: Graph<NodeDataType, VertexDataType>, graphParams: GraphParameters };
export interface GraphState { scene: Scene, componentId: string, selectedNodeId?: string, selectedVerticeId?: string };

export default class GraphCanvas<T, U> extends Component<GraphProps<T, U>, GraphState> {

    drawNode(node: Node<T>, id: string) {
        this.state.scene.add(node);
    }

    drawEdge(edge: Vertex<U>) {
        let srcNode = this.props.graphData.nodes[edge.src];
        let dstNode = this.props.graphData.nodes[edge.dst];
        edge.position.addVectors(srcNode.position, dstNode.position).divideScalar(2.0);
        edge.scale.set(edge.opt.size, edge.opt.size, dstNode.position.distanceTo(srcNode.position));
        edge.lookAt(dstNode.position);

        this.state.scene.add(edge);

        if (edge.arrow) {
            edge.arrow.position.copy(edge.position);
            edge.arrow.lookAt(dstNode.position);
            this.state.scene.add(edge.arrow);
        }
    }

    draw(renderer: WebGLRenderer) {
        // Draw nodes
        for (let id in this.props.graphData.nodes) {
            this.drawNode(this.props.graphData.nodes[id], id);
        }
        // Draw vertices
        this.props.graphData.vertices.forEach(edge => this.drawEdge(edge));

        // Spatial optimization
        if (this.props.graphParams.runOptimization) {
            this.props.graphData.optimize();
        }

        document.getElementById(this.state.componentId).append(renderer.domElement);
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

    render() {
        let renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(this.props.graphParams.width, this.props.graphParams.height);

        let light = new HemisphereLight(0xffffff, 0.5);
        let directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);

        let camera = new PerspectiveCamera(70, this.props.graphParams.width / this.props.graphParams.height);
        camera.position.setZ(this.props.graphParams.cameraZ);

        let controls = new TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = this.props.graphParams.rotateSpeed;

        camera.add(light);
        camera.add(directionalLight);

        let scene = new Scene();
        scene.add(camera);

        this.setState({ ...this.state, scene: scene })


        this.animate(renderer, scene, camera, controls);


        let componentId = `Graph${Guid.create().toString()}`;
        this.setState({ ...this.state, componentId: componentId });

        //TODO Resize & show save button

        useEffect((() => this.draw(renderer)).bind(this))

        const style = {
            width: `${this.props.graphParams.width}px`,
            height: `${this.props.graphParams.height}px`
        };

        return <div className="graphCanvas" id={componentId} onClick={this.onClick.bind(this)} onMouseMove={this.onMouseMove.bind(this)} style={style}></div>;
    }
}


