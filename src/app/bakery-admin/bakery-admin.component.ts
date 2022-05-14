import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Bakery, BakeryUserListFunctionResponse } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Component({
    selector: 'app-bakery-admin',
    templateUrl: './bakery-admin.component.html',
    styleUrls: ['./bakery-admin.component.scss'],
})
export class BakeryAdminComponent {
    bakeryId$: Observable<string>;
    bakery$: Observable<Bakery>;
    bakeryUsers$: Observable<BakeryUserListFunctionResponse>;

    constructor(
        private route: ActivatedRoute,
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        private fns: AngularFireFunctions
    ) {
        this.bakeryId$ = route.paramMap.pipe(
            map((paramMap) => paramMap.get('id'))
        );
        this.bakery$ = this.bakeryId$.pipe(
            filter((bakeryId) => !!bakeryId),
            map((bakeryId) =>
                afs.doc<Bakery>(`bakery/${bakeryId}`).valueChanges()
            ),
            mergeMap((bakery) => bakery)
        );
        this.bakeryUsers$ = this.bakeryId$.pipe(
            filter((bakeryId) => !!bakeryId),
            map((bakeryId) =>
                fns.httpsCallable('listBakeryUsers')({ bakeryId })
            ),
            mergeMap((result) => result)
        );
    }
}
