import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SubscribableTitleServiceService } from '../subscribable-title-service.service';
import { RecipeEditFabService } from '../recipe-edit-fab/recipe-edit-fab.service';

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
        private recipeEditFabService: RecipeEditFabService
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
        this.recipeIdSubscription = route.paramMap
            .pipe(
                map((paramMap) => ({
                    recipeId: paramMap.get('recipeId'),
                    bakeryId: paramMap.get('id'),
                }))
            )
            .subscribe(({ recipeId, bakeryId }) => {
                console.log({ recipeId, bakeryId });
                this.recipeEditFabService.showButton(recipeId, bakeryId);
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
