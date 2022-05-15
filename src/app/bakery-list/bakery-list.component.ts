import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Bakery } from '../interfaces';
import { SubscribableTitleServiceService } from '../subscribable-title-service.service';
import { BakeryAddFabServiceService } from '../bakery-add-fab/bakery-add-fab-service.service';

@Component({
    selector: 'app-bakery-list',
    templateUrl: './bakery-list.component.html',
    styleUrls: ['./bakery-list.component.scss'],
})
export class BakeryListComponent {
    bakeries$: Observable<Bakery[]>;
    adminBakeries$: Observable<Bakery[]>;

    // Just here for the loading spinner
    combined$: Observable<[Bakery[], Bakery[]]>;

    constructor(
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        private titleService: SubscribableTitleServiceService,
        private bakeryAddFabService: BakeryAddFabServiceService
    ) {
        const bakeries$ = auth.user.pipe(
            filter((user) => !!user),
            map((user) =>
                afs.collection<Bakery>('bakery', (ref) =>
                    ref.where('users', 'array-contains', user.uid)
                )
            ),
            mergeMap((bakeries) => bakeries.valueChanges({ idField: 'id' }))
        );
        /* Filter all bakeries where the user is not admin */
        this.bakeries$ = bakeries$.pipe(
            switchMap((bakeries) =>
                auth.user.pipe(
                    filter((user) => !!user),
                    map((user) =>
                        bakeries.filter(
                            (bakery) => bakery.admins.indexOf(user.uid) < 0
                        )
                    )
                )
            )
        );
        /* Filter all bakeries where the user is admin */
        this.adminBakeries$ = bakeries$.pipe(
            switchMap((bakeries) =>
                auth.user.pipe(
                    filter((user) => !!user),
                    map((user) =>
                        bakeries.filter(
                            (bakery) => bakery.admins.indexOf(user.uid) >= 0
                        )
                    )
                )
            )
        );
        this.combined$ = combineLatest([this.adminBakeries$, this.bakeries$]);
        this.titleService.setTitle('Bakery list');
        bakeryAddFabService.showButton();
    }
}
