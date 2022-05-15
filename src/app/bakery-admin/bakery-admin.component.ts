import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Bakery, BakeryUserListFunctionResponse } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { BakeryAdminUserAddFabService } from '../bakery-admin-user-add-fab/bakery-admin-user-add-fab.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-bakery-admin',
    templateUrl: './bakery-admin.component.html',
    styleUrls: ['./bakery-admin.component.scss'],
})
export class BakeryAdminComponent implements OnDestroy {
    bakeryId$: Observable<string>;
    bakery$: Observable<Bakery>;
    bakeryUsers$: Observable<BakeryUserListFunctionResponse>;

    bakeryIdSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        private fns: AngularFireFunctions,
        public bakeryAdminUserAddFabService: BakeryAdminUserAddFabService,
        public loadingController: LoadingController,
        public alertController: AlertController
    ) {
        this.bakeryId$ = bakeryAdminUserAddFabService.refreshToken$.pipe(
            switchMap(() =>
                route.paramMap.pipe(map((paramMap) => paramMap.get('id')))
            )
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

        // Update bakeryId for the user add fab
        this.bakeryIdSubscription = this.bakeryId$.subscribe((bakeryId) => {
            this.bakeryAdminUserAddFabService.showButton(bakeryId);
        });
    }

    // Force destroy component on route change
    @HostListener('unloaded')
    ngOnDestroy(): void {
        this.bakeryAdminUserAddFabService.hideButton();
        this.bakeryIdSubscription.unsubscribe();
    }

    async removeUser(email: string, dePromote: boolean = false) {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            const callable = this.fns.httpsCallable('removeUserFromBakery');
            await callable({
                userEmail: email,
                admin: dePromote,
                bakeryId: this.bakeryAdminUserAddFabService.bakeryId,
            }).toPromise();
            this.bakeryAdminUserAddFabService.reloadUserData();
        } catch (e) {
            console.log({ e });

            const alert = await this.alertController.create({
                header: 'Error',
                message: e?.message ?? 'An unknown error occurred',
                buttons: ['OK'],
            });

            await alert.present();
        } finally {
            await loading.dismiss();
        }
    }
}
