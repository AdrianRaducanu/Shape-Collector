import {Graphics} from "pixi.js";

export default class Factory {
    static async create(shape: string, color: string,) {
        let displayObject;
        console.log(shape, color)
        switch (shape) {
            case 'circle':
                displayObject = new Graphics();
                displayObject.circle(0, 0, 25);
                displayObject.fill(color);
                break;
            case 'square':
                displayObject = new Graphics();
                displayObject.rect(0, 0, 40, 40);
                displayObject.pivot.set(20, 20);
                displayObject.fill(color);
                break;
            case 'diamond':
                displayObject = new Graphics();
                displayObject.rect(0, 0, 40, 40);
                displayObject.pivot.set(20, 20);
                displayObject.angle = 45;
                displayObject.fill(color);
                break;
            case 'rectangle':
                displayObject = new Graphics();
                displayObject.pivot.set(25, 15);
                displayObject.rect(0, 0, 50, 30);
                displayObject.fill(color);
                break;
            default:
                console.warn("Unknown type: ");
                break;
        }

        displayObject.eventMode = 'static';
        displayObject.cursor = 'pointer';
        displayObject.on('pointerdown', () => {
            console.log('click');
        })
        return displayObject;
    }
}