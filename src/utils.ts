export const SHAPES = ['circle', 'rectangle', 'square', 'diamond'];
export const COLORS = ['red', 'green', 'blue', 'yellow'];
export const LEVELS = [3, 6, 10];
export const HOLES = [
    {
        x: 300,
        y: 60,
    },
    {
        x: 100,
        y: 200,
    },
    {
        x: 200,
        y: 200,
    },
    {
        x: 300,
        y: 200,
    },
    {
        x: 400,
        y: 200,
    },
    {
        x: 500,
        y: 200,
    },
    {
        x: 100,
        y: 300,
    },
    {
        x: 200,
        y: 300,
    },
    {
        x: 300,
        y: 300,
    },
    {
        x: 400,
        y: 300,
    },
    {
        x: 500,
        y: 300,
    },
];
export const DIFFICULTY = {
    'low': {
        'colors': 2,
        'selectionTime': 6,
        'penalty': 0.5,
    },
    'medium': {
        'colors': 3,
        'selectionTime': 4,
        'penalty': 1,
    },
    'high': {
        'colors': 4,
        'selectionTime': 2,
        'penalty': 2,
    },
}

export function getRandomShape(colors: string[], shapes: string[]) {
    if (colors.length === 0 || shapes.length === 0) {
        throw new Error('Color and shape arrays must not be empty.');
    }

    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    return { color, shape };
}

type ShapeColor = { shape: string; color: string };

export function generateShapeColorPairs(
    shapes: string[],
    colors: string[],
    mainShape: string,
    mainColor: string,
    level: 1 | 2 | 3
): ShapeColor[] {
    const total = 10;
    const matchCount = level === 1 ? 3 : level === 2 ? 6 : 10;

    if (!shapes.includes(mainShape)) {
        throw new Error(`mainShape "${mainShape}" must be in shapes[]`);
    }

    if (!colors.includes(mainColor)) {
        throw new Error(`mainColor "${mainColor}" must be in colors[]`);
    }

    const result: ShapeColor[] = [];

    // Add exact matches first
    for (let i = 0; i < matchCount; i++) {
        result.push({ shape: mainShape, color: mainColor });
    }

    // Add distractors: must not match both shape and color
    while (result.length < total) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Skip if it's an exact match
        if (shape === mainShape && color === mainColor) continue;

        result.push({ shape, color });
    }

    // Shuffle array
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

