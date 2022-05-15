import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Bakery, Recipe } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SubscribableTitleServiceService } from '../subscribable-title-service.service';
import { RecipeEditFabService } from '../recipe-edit-fab/recipe-edit-fab.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'app-recipe-detail-view',
    templateUrl: './recipe-detail-view.component.html',
    styleUrls: ['./recipe-detail-view.component.scss'],
})
export class RecipeDetailViewComponent implements OnDestroy {
    recipeId$: Observable<string>;
    recipe$: Observable<Recipe>;

    recipeSubscription: Subscription;
    recipeIdSubscription: Subscription;

    constructor(
        private readonly route: ActivatedRoute,
        private afs: AngularFirestore,
        private titleService: SubscribableTitleServiceService,
        private recipeEditFabService: RecipeEditFabService,
        private auth: AngularFireAuth
    ) {
        /* Make data available */
        this.recipeId$ = route.paramMap.pipe(
            map((paramMap) => paramMap.get('recipeId'))
        );
        this.recipe$ = this.recipeId$.pipe(
            switchMap((recipeId) =>
                afs.doc<Recipe>(`recipe/${recipeId}`).valueChanges()
            )
        );

        // Activate edit button with correct id
        this.recipeIdSubscription = combineLatest([
            route.paramMap.pipe(
                map((paramMap) => ({
                    recipeId: paramMap.get('recipeId'),
                    bakeryId: paramMap.get('id'),
                }))
            ),
            auth.user,
            route.paramMap.pipe(
                map((paramMap) => paramMap.get('id')),
                mergeMap((bakeryId) =>
                    afs.doc<Bakery>(`bakery/${bakeryId}`).valueChanges()
                )
            ),
        ]).subscribe(([{ recipeId, bakeryId }, user, bakery]) => {
            if (bakery.admins.includes(user.uid)) {
                this.recipeEditFabService.showButton(recipeId, bakeryId);
            }
        });

        // Update title
        this.recipeSubscription = this.recipe$.subscribe((recipe) => {
            this.titleService.setTitle(`Recipe: ${recipe.name}`);
        });
    }

    ngOnDestroy(): void {
        this.recipeSubscription.unsubscribe();
        this.recipeIdSubscription.unsubscribe();
    }
}
