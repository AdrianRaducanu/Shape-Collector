import './Game.css'
import type {Difficulty} from "../types";
import Canvas from "./Canvas.tsx";
import {COLORS, generateShapeColorPairs, getRandomShape, SHAPES} from "../utils.ts";
import Engine from "../Engine/Engine.ts";

type GameProps = {
    difficulty: Difficulty | null;
    onBackToMenu: () => void;
};

const Game = ({ difficulty, onBackToMenu }: GameProps) => {
    const level: 1 | 2 | 3 = 1;
    const shapes = SHAPES;
    const colors =
        difficulty === 'low'
            ? COLORS.slice(0, 2)
            : difficulty === 'medium'
                ? COLORS.slice(0, 3)
                : COLORS;
    const startGame = async () => {
        const {color, shape} = getRandomShape(colors, shapes);
        await Engine.instance.generateMainShape(shape, color);
        const pairs = generateShapeColorPairs(shapes, colors, shape, color, level);
        console.log(pairs);
        await Engine.instance.generateShapes(pairs);
    }

    return (
        <div className="game-container">
            <button onClick={onBackToMenu}>Back to menu</button>
            <h2>Game Started</h2>
            <p>Difficulty: <strong>{difficulty}</strong></p>
            <button onClick={startGame}>Start</button>
            <Canvas/>
        </div>
    );
};

export default Game;