import './Game.css'
import type {Difficulty} from "../types";
import Canvas from "./Canvas.tsx";
import {COLORS, generateShapeColorPairs, getRandomShape, SHAPES} from "../utils.ts";
import Engine from "../Engine/Engine.ts";
import {useEffect, useState} from "react";

type GameProps = {
    difficulty: Difficulty | null;
    onBackToMenu: () => void;
};

const Game = ({ difficulty, onBackToMenu }: GameProps) => {
    const [level, setLevel] = useState<1 | 2 | 3>(1);
    const [matchShapes, setMatchShapes] = useState(0);
    const [winCondition, setWinCondition] = useState(3);
    const shapes = SHAPES;
    const colors =
        difficulty === 'low'
            ? COLORS.slice(0, 2)
            : difficulty === 'medium'
                ? COLORS.slice(0, 3)
                : COLORS;

    const startGame = async () => {
        const {shape: mainShape, color: mainColor} = getRandomShape(colors, shapes);
        await Engine.instance.generateMainShape(mainShape, mainColor);

        const pairs = generateShapeColorPairs(shapes, colors, mainShape, mainColor, level);
        await Engine.instance.generateShapes(pairs, (shape, color) => {
            const isMatch = shape === mainShape && color === mainColor;
            if (isMatch) {
                setMatchShapes(prev => prev + 1);
            }
        });
    }

    useEffect(() => {
        if (matchShapes === winCondition) {
            Engine.instance.finishLevel();
            setLevel((prev) => (prev < 3 ? (prev + 1) as 1 | 2 | 3 : prev));
            setMatchShapes(0);
        }
    }, [matchShapes, winCondition]);

    useEffect(() => {
        const newLvl = level === 1
            ? 3
            : level === 2
                ? 6
                : 10;
        setWinCondition(newLvl);
    }, [winCondition,level]);

    return (
        <div className="game-container">
            <button onClick={onBackToMenu}>Back to menu</button>
            <h2>Game Started</h2>
            <p>Level: <strong>{level}</strong></p>
            <p>Difficulty: <strong>{difficulty}</strong></p>
            <button onClick={startGame}>Start</button>
            <Canvas/>
        </div>
    );
};

export default Game;