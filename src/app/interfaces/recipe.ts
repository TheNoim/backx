export interface Recipe {
    bakery: string;
    description?: string;
    ingredients: Ingredient[];
    shortDescription?: string;
    name: string;
    steps: string[];
    id: string;
}

export const VALID_UNITS = ['g', 'kg', 'ml', 'l'] as const;
export type Unit = typeof VALID_UNITS[number];

export interface Ingredient {
    count: number;
    name: string;
    unit: Unit;
}
