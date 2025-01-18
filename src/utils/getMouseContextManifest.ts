import { IMouseContextManifest } from "../interfaces/IMouseContextManifest";

export const getMouseContextManifest = (): Array<IMouseContextManifest> => {
    const manifest: Array<IMouseContextManifest> = [];
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
        const boundingBox = element.getBoundingClientRect();
        const computedStyle = getComputedStyle(element);
        const cursor = computedStyle.cursor;

        manifest.push({ element, boundingBox, cursor });
    });

    return manifest;
};
