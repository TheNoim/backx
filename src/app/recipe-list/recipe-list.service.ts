import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecipeListService {
    public readonly refreshToken$ = new BehaviorSubject(undefined);

    constructor() {}
}
