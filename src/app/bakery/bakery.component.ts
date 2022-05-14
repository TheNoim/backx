import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, mergeMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import type firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

export interface UserSettings {
    fullName?: string;
}

@Component({
    selector: 'app-bakery',
    templateUrl: './bakery.component.html',
    styleUrls: ['./bakery.component.scss'],
})
export class BakeryComponent {
    userSettings$: Observable<UserSettings>;
    user$: Observable<firebase.User>;

    constructor(
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        private router: Router
    ) {
        this.user$ = auth.user;
        this.userSettings$ = auth.user.pipe(
            filter((user) => !!user),
            map((user) => afs.doc<UserSettings>(`user/${user.uid}`)),
            mergeMap((doc) => doc.valueChanges())
        );
    }

    async logout() {
        await this.auth.signOut();
        await this.router.navigateByUrl('/login');
    }
}
