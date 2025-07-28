import { useEffect, useState, useRef } from 'react';

type TimerProps = {
    duration: number;
    start: boolean;
    resetKey?: number;
    onTimeout: () => void;
};

const Timer = ({ duration, start, resetKey, onTimeout }: TimerProps) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    // @ts-ignore
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Reset timer when resetKey changes
    useEffect(() => {
        clearInterval(intervalRef.current!);
        setTimeLeft(duration);
    }, [resetKey, duration]);

    // Handle start/pause
    useEffect(() => {
        if (!start) {
            clearInterval(intervalRef.current!);
            return;
        }

        const endTime = Date.now() + timeLeft * 1000;

        intervalRef.current = setInterval(() => {
            const newTime = Math.max(0, (endTime - Date.now()) / 1000);
            setTimeLeft(newTime);

            if (newTime === 0) {
                clearInterval(intervalRef.current!);
                onTimeout();
            }
        }, 100);

        return () => clearInterval(intervalRef.current!);
    }, [start]);

    return (
        <p>Time left: <strong>{timeLeft.toFixed(1)}s</strong></p>
    );
};

export default Timer;
