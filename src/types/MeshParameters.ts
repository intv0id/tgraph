import { Material } from 'three';
import { makeMaterial } from '../utils';
import { ShaderTypes } from './Shaders';

export class MeshParameters<MeshType> {
    constructor(
        size: number = 1,
        color: string = "00ff00",
        hoverColor: string = "ff0000",
        shaderType: ShaderTypes = ShaderTypes.BASIC,
        onEnterHover: Function = (mesh: MeshType) => { },
        onExitHover: Function = (mesh: MeshType) => { },
        onClickAction: Function = (mesh: MeshType) => { }
    ) {
        this.size = size;
        this.material = makeMaterial(color, shaderType);
        this.hoverMaterial = makeMaterial(hoverColor, shaderType);
        this.onExitHover = onExitHover;
        this.onEnterHover = onEnterHover;
        this.onClickAction = onClickAction;
    }
    material: Material;
    hoverMaterial: Material;
    size: number;
    onEnterHover: Function;
    onExitHover: Function;
    onClickAction: Function;
};
