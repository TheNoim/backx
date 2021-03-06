import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import type firebase from 'firebase/compat/app';
import { NavigationEnd, Router } from '@angular/router';
import { SubscribableTitleServiceService } from '../subscribable-title-service.service';
import { BakeryAdminUserAddFabService } from '../bakery-admin-user-add-fab/bakery-admin-user-add-fab.service';
import { RecipeEditFabService } from '../recipe-edit-fab/recipe-edit-fab.service';
import { BakeryAddFabServiceService } from '../bakery-add-fab/bakery-add-fab-service.service';

export interface UserSettings {
    fullName?: string;
}

@Component({
    selector: 'app-bakery',
    templateUrl: './bakery.component.html',
    styleUrls: ['./bakery.component.scss'],
})
export class BakeryComponent implements OnDestroy {
    userSettings$: Observable<UserSettings>;
    user$: Observable<firebase.User>;
    title$: Observable<string>;
    routeSubscription: Subscription;

    constructor(
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        private router: Router,
        private titleService: SubscribableTitleServiceService,
        private bakeryAdminUserAddFabService: BakeryAdminUserAddFabService,
        private recipeEditFabService: RecipeEditFabService,
        private bakeryAddFabService: BakeryAddFabServiceService
    ) {
        this.user$ = auth.user;
        this.userSettings$ = auth.user.pipe(
            filter((user) => !!user),
            switchMap((user) =>
                afs.doc<UserSettings>(`user/${user.uid}`).valueChanges()
            )
        );
        this.title$ = this.titleService.title;
        // Force dismiss BakeryAdminUserAddFab on route change
        // For some reason angular router sometimes doesn't unload the old route component
        this.routeSubscription = this.router.events
            .pipe(filter((value) => value instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (!event.urlAfterRedirects.includes('admin')) {
                    this.bakeryAdminUserAddFabService.hideButton();
                }
                if (!event.urlAfterRedirects.includes('recipes')) {
                    this.recipeEditFabService.hideButton();
                }
                if (event.urlAfterRedirects !== '/bakery') {
                    this.bakeryAddFabService.hideButton();
                } else {
                    this.bakeryAddFabService.showButton();
                }
            });
    }

    async logout() {
        await this.auth.signOut();
        // Hard redirect to clear cache
        window.location.href = '/login';
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }
}
