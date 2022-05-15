import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BakeryAddFabServiceService {
    private buttonState = false;

    constructor() {}

    get shouldShowButton() {
        return this.buttonState;
    }

    showButton() {
        this.buttonState = true;
    }

    hideButton() {
        this.buttonState = false;
    }
}
