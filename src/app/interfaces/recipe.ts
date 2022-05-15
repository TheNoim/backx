export interface Recipe {
    bakery: string;
    description?: string;
    ingredients: Ingredient[];
    shortDescription?: string;
    name: string;
    steps: string[];
    id: string;
}

export type Unit = 'g' | 'kg' | 'ml' | 'l';

export interface Ingredient {
    count: number;
    name: string;
    unit: Unit;
}
