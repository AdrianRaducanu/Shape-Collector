import {Application, Graphics} from 'pixi.js';
import {HOLES} from "../utils.ts";
import type {Difficulty} from "../types";
import Factory from "./Factory.ts";

class SingletonEnforcer {
    static _instance: Engine;
}

export default class Engine {
    app: Application | undefined;

    static get instance() {
        if (!SingletonEnforcer._instance) {
            SingletonEnforcer._instance = new Engine(new SingletonEnforcer());
        }
        return SingletonEnforcer._instance;
    }

    constructor(enforcer: SingletonEnforcer) {
        if (!(enforcer instanceof SingletonEnforcer)) {
            throw new Error('Use Engine.instance!');
        }
    }

    async initialize(container: HTMLElement) {
        if (this.app) {
            this.cleanUp();
        }

        const app = new Application();
        // @ts-ignore
        globalThis.__PIXI_APP__ = app;

        await app.init({
            width: 600,
            height: 400,
            backgroundAlpha: 1,
        });

        this.app = app;

        container.appendChild(app.canvas);

        this.createHoles()
    }

    createHoles() {
        HOLES.forEach(h => {
            const circle = new Graphics();
            circle.fill({ color: '#313131' });
            circle.circle(0, 0, 40);
            circle.position.set(h.x, h.y);
            circle.fill();
            this.app?.stage.addChild(circle)
        });

    }

    async generateMainShape(shape: string, color: string) {
        const obj = await Factory.create(shape, color);
        // @ts-ignore
        obj.position.set(HOLES[0].x, HOLES[0].y);
        console.log(obj)
        this.app?.stage.addChild(obj)
    }

    async generateShapes(pairs) {
        for(let i= 0; i<pairs.length; i++) {
            const obj = await Factory.create(pairs[i].shape, pairs[i].color);
            obj.position.set(HOLES[i + 1].x, HOLES[i + 1].y);
            this.app?.stage.addChild(obj);
        }
    }

    cleanUp() {
        if (this.app) {
            this.app.destroy(true);
            this.app = undefined;
        }
    }
}
