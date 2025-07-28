import {Application, Container, Graphics, Text} from 'pixi.js';
import {HOLES} from "../utils.ts";
import Factory from "./Factory.ts";
import gsap from 'gsap';

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
            backgroundColor: "#151b1e"
        });

        this.app = app;

        container.appendChild(app.canvas);

        this.createHoles()
    }

    createHoles() {
        const holes = new Container();
        holes.label = 'holes';
        HOLES.forEach(h => {
            const circle = new Graphics();
            circle.fill({ color: '#1f282c' });
            circle.circle(0, 0, 40);
            circle.position.set(h.x, h.y);
            circle.fill();
            holes.addChild(circle)
        });
        this.app?.stage.addChild(holes);
    }

    async generateMainShape(shape: string, color: string) {
        const obj = await Factory.create(shape, color);

        obj.position.set(HOLES[0].x, HOLES[0].y);
        obj.label = 'main shape';
        this.app?.stage.addChild(obj);
    }

    async generateShapes(pairs: Array<{shape: string, color: string}>, cb: (shape: string, color: string) => void) {
        const shapes = new Container();
        shapes.label = 'shapes';
        for(let i= 0; i<pairs.length; i++) {
            const { shape, color } = pairs[i];
            const obj = await Factory.create(shape, color, () => cb(shape, color));
            obj.position.set(HOLES[i + 1].x, HOLES[i + 1].y);
            shapes.addChild(obj);
        }
        this.app?.stage.addChild(shapes);
    }

    finishLevel(win: boolean = true, cb?: () => void) {
        this._clearShapes();
        this._generateResult(win, cb);
    }

    async showCountdown(cb?: () => void) {
        if (!this.app) return;

        const messages = ['3', '2', '1', 'Start!'];
        let delay = 0;

        for (const msg of messages) {
            const text = new Text({
                text: msg,
                style: {
                    fill: '#ffffff',
                    fontSize: 64,
                    fontWeight: 'bold',
                }
            });

            text.anchor.set(0.5);
            text.scale.set(1);
            text.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
            text.alpha = 0;
            this.app?.stage.addChild(text);

            gsap.to(text, {
                delay,
                alpha: 1,
                scale: 1.5,
                duration: 0.5,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    this.app?.stage.removeChild(text);
                    text.destroy();
                    if (msg === 'Start!' && cb) {
                        cb();
                    }
                }
            });
            delay += 1;
        }
    }


    _generateResult(win: boolean = true, cb?: () => void) {
        if (!this.app) return;

        const message = win ? 'You Won!' : 'You Lost!';
        const color = '#cecdcd';

        const resultText = new Text({
            text: message,
            style: {
                fill: color,
                fontSize: 48,
                fontWeight: 'bold',
            }
        });

        resultText.anchor.set(0.5);
        resultText.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        resultText.alpha = 0;

        this.app.stage.addChild(resultText);

        gsap.to(resultText, {
            alpha: 1,
            duration: 1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.app?.stage.removeChild(resultText);
                resultText.destroy();
                if(cb) {
                    cb();
                }
            }
        });
    }

    _clearShapes() {
        const mainShape = this.app?.stage.children.find(child => child.label === 'main shape');
        if (mainShape) {
            this.app?.stage.removeChild(mainShape);
            mainShape.destroy({ children: true });
        }

        const shapes = this.app?.stage.children.find(child => child.label === 'shapes');
        if (shapes) {
            this.app?.stage.removeChild(shapes);
            shapes.destroy({ children: true });
        }
    }

    cleanUp() {
        gsap.globalTimeline.clear();
        if (this.app) {
            this.app.destroy(true);
            this.app = undefined;
        }
    }
}
