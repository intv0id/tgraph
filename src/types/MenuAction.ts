import { Vector2 } from "three";

export interface IMenuAction {
    text: string,
    action: ((mouseLocation: Vector2) => void) | undefined,
    href: string | undefined,
    downloadName: string | undefined,
}