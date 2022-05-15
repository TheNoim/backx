import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* Because our settings fab needs to be located at the top of the component tree, we need to manage the users in this service */
@Injectable({
    providedIn: 'root',
})
export class BakeryAdminUserAddFabService {
    public readonly refreshToken$ = new BehaviorSubject(undefined);

    private buttonState = false;
    private currentBakeryId?: string;

    constructor() {}

    get shouldShowButton() {
        return this.buttonState;
    }

    get bakeryId() {
        return this.currentBakeryId;
    }

    showButton(bakeryId: string) {
        this.buttonState = true;
        this.currentBakeryId = bakeryId;
    }

    hideButton() {
        this.buttonState = false;
    }

    reloadUserData() {
        this.refreshToken$.next(undefined);
    }
}
