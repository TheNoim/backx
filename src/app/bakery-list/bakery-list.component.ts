import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Bakery } from '../interfaces';

@Component({
    selector: 'app-bakery-list',
    templateUrl: './bakery-list.component.html',
    styleUrls: ['./bakery-list.component.scss'],
})
export class BakeryListComponent implements OnInit {
    bakeries$: Observable<Bakery[]>;
    adminBakeries$: Observable<Bakery[]>;

    constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
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
            map((bakeries) =>
                auth.user.pipe(
                    filter((user) => !!user),
                    map((user) =>
                        bakeries.filter(
                            (bakery) => bakery.admins.indexOf(user.uid) === -1
                        )
                    )
                )
            ),
            mergeMap((bakeries) => bakeries)
        );
        /* Filter all bakeries where the user is admin */
        this.adminBakeries$ = bakeries$.pipe(
            map((bakeries) =>
                auth.user.pipe(
                    filter((user) => !!user),
                    map((user) =>
                        bakeries.filter(
                            (bakery) => bakery.admins.indexOf(user.uid) >= 0
                        )
                    )
                )
            ),
            mergeMap((bakeries) => bakeries)
        );
    }

    ngOnInit() {}
}
