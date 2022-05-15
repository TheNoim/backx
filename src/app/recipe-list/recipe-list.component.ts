import { Component, OnDestroy } from '@angular/core';
import { RecipeListService } from './recipe-list.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Bakery, Recipe } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SubscribableTitleServiceService } from '../subscribable-title-service.service';
import { RecipeEditFabService } from '../recipe-edit-fab/recipe-edit-fab.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnDestroy {
    bakeryId$: Observable<string>;
    recipes$: Observable<Recipe[]>;

    bakerySubscription: Subscription;

    constructor(
        private readonly recipeListService: RecipeListService,
        private readonly route: ActivatedRoute,
        private afs: AngularFirestore,
        private titleService: SubscribableTitleServiceService,
        private recipeFabService: RecipeEditFabService,
        private auth: AngularFireAuth
    ) {
        this.bakeryId$ = recipeListService.refreshToken$.pipe(
            switchMap(() =>
                route.paramMap.pipe(map((paramMap) => paramMap.get('id')))
            )
        );

        this.bakerySubscription = combineLatest([
            this.bakeryId$.pipe(
                filter((bakeryId) => !!bakeryId),
                switchMap((bakeryId) =>
                    afs
                        .doc<Bakery>(`bakery/${bakeryId}`)
                        .valueChanges({ idField: 'id' })
                )
            ),
            auth.user,
        ]).subscribe(([bakery, user]) => {
            this.titleService.setTitle(`Recipes for Bakery ${bakery.name}`);
            // Only show edit button if user is admin
            if (bakery.admins.includes(user.uid)) {
                this.recipeFabService.showButton(null, bakery.id);
            }
        });

        this.recipes$ = this.bakeryId$.pipe(
            switchMap((bakeryId) =>
                afs
                    .collection<Recipe>('recipe', (ref) =>
                        ref.where('bakery', '==', bakeryId)
                    )
                    .valueChanges({ idField: 'id' })
            )
        );
    }

    ngOnDestroy(): void {
        this.bakerySubscription.unsubscribe();
    }
}
