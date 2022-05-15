import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RecipeEditFabService {
    private buttonState = false;
    private currentRecipeId?: string;
    private currentBakeryId?: string;

    constructor() {}

    get shouldShowButton() {
        return this.buttonState;
    }

    get recipeId() {
        return this.currentRecipeId;
    }

    get bakeryId() {
        return this.currentBakeryId;
    }

    showButton(recipeId: string, bakeryId: string) {
        this.currentRecipeId = recipeId;
        this.currentBakeryId = bakeryId;
        this.buttonState = true;
    }

    hideButton() {
        this.buttonState = false;
    }
}
