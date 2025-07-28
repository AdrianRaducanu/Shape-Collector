import './Game.css'
import type {Difficulty} from "../types";
import Canvas from "./Canvas.tsx";
import {COLORS, generateShapeColorPairs, getRandomShape, SHAPES} from "../utils.ts";
import Engine from "../Engine/Engine.ts";
import {useCallback, useEffect, useState} from "react";
import Timer from "./Timer.tsx";

type GameProps = {
    difficulty: Difficulty | null;
    onBackToMenu: () => void;
};

const Game = ({ difficulty, onBackToMenu }: GameProps) => {
    const colors =
        difficulty === 'low'
            ? COLORS.slice(0, 2)
            : difficulty === 'medium'
                ? COLORS.slice(0, 3)
                : COLORS;
    const penalty =
        difficulty === 'low'
            ? 0.5
            : difficulty === 'medium'
                ? 1
                : 2;
    const timer =
        difficulty === 'low'
            ? 6
            : difficulty === 'medium'
                ? 4
                : 2;

    const [level, setLevel] = useState<1 | 2 | 3>(1);
    const [matchShapes, setMatchShapes] = useState(0);
    const [winCondition, setWinCondition] = useState(3);
    const shapes = SHAPES;
    const [score, setScore] = useState(0);
    const [start, setStart] = useState(false);
    const [resetTimer, setResetTimer] = useState(0);
    const [startBtnVisible, setStartBtnVisible] = useState(true);

    const onBackBtn = () => {
        Engine.instance.cleanUp();
        onBackToMenu();
    }

    const startGame = async () => {
        await Engine.instance.showCountdown(() => startRound());
        setStartBtnVisible(false);
    }

    const startRound = async () => {
        setStart(true);
        const {shape: mainShape, color: mainColor} = getRandomShape(colors, shapes);
        await Engine.instance.generateMainShape(mainShape, mainColor);

        const pairs = generateShapeColorPairs(shapes, colors, mainShape, mainColor, level);
        await Engine.instance.generateShapes(pairs, (shape, color) => {
            const isMatch = shape === mainShape && color === mainColor;
            if (isMatch) {
                setMatchShapes(prev => prev + 1);
                setScore(prev => prev + 1);
            } else {
                setScore(prev => Math.max(0, prev - penalty));
            }
        });
    }

    const onTimeout = useCallback(() => {
        Engine.instance.finishLevel(false, () => Engine.instance.cleanUp());
    }, []);

    //on win
    useEffect(() => {
        if (matchShapes === winCondition) {
            setStart(false);
            setResetTimer(prev => prev + 1);
            if(level < 3) {
                setLevel((prev) => (prev < 3 ? (prev + 1) as 1 | 2 | 3 : prev));
                setMatchShapes(0);
            } else {
                //finish game
                Engine.instance.cleanUp();
                console.log('finish');
            }
        }
    }, [matchShapes, winCondition]);

    //on new level
    useEffect(() => {
        const newLvl = level === 1
            ? 3
            : level === 2
                ? 6
                : 10;
        setWinCondition(newLvl);
        Engine.instance.finishLevel(true, () => startRound());
    }, [level]);

    return (
        <div className="game-container">
            <button onClick={onBackBtn}>Back to menu</button>
            <h2>Game Started</h2>
            <p>Level: <strong>{level}</strong></p>
            <p>Score: <strong>{score}</strong></p>
            <p>Difficulty: <strong>{difficulty}</strong></p>
            <div className="start-btn">
                {startBtnVisible && <button onClick={startGame}>Start</button>}
                {!startBtnVisible &&
                    <Timer
                        duration={timer}
                        start={start}
                        onTimeout={onTimeout}
                        resetKey={resetTimer}
                    />
                }
            </div>

            <Canvas/>

        </div>
    );
};

export default Game;