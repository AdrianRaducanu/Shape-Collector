import { useEffect, useRef } from 'react';
import Engine from '../Engine/Engine';


const Canvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let destroyed = false;

        const start = async () => {
            if (containerRef.current) {
                await Engine.instance.initialize(containerRef.current);
                if (destroyed) Engine.instance.cleanUp();
            }
        };

        start();

        return () => {
            destroyed = true;
            Engine.instance.cleanUp();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default Canvas;
