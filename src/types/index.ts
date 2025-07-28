export type ShapeType = 'circle' | 'rectangle' | 'square' | 'diamond';
export type ColorType = 'red' | 'green' | 'blue' | 'yellow';

export type Difficulty = 'low' | 'medium' | 'high';

export interface ShapeData {
    id: string;
    shape: ShapeType;
    color: ColorType;
    isCorrect: boolean;
    holeIndex: number;
}
