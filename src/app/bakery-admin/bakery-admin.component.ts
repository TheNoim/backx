import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Bakery, BakeryUserListFunctionResponse } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { BakeryAdminUserAddFabService } from '../bakery-admin-user-add-fab/bakery-admin-user-add-fab.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { SubscribableTitleServiceService } from '../subscribable-title-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    bakerySubscription: Subscription;

    settingsFormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    });

    constructor(
        private route: ActivatedRoute,
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        private fns: AngularFireFunctions,
        public bakeryAdminUserAddFabService: BakeryAdminUserAddFabService,
        public loadingController: LoadingController,
        public alertController: AlertController,
        private titleService: SubscribableTitleServiceService
    ) {
        this.bakeryId$ = bakeryAdminUserAddFabService.refreshToken$.pipe(
            switchMap(() =>
                route.paramMap.pipe(map((paramMap) => paramMap.get('id')))
            )
        );
        this.bakery$ = this.bakeryId$.pipe(
            filter((bakeryId) => !!bakeryId),
            switchMap((bakeryId) =>
                afs.doc<Bakery>(`bakery/${bakeryId}`).valueChanges()
            )
        );
        this.bakeryUsers$ = this.bakeryId$.pipe(
            filter((bakeryId) => !!bakeryId),
            switchMap((bakeryId) =>
                fns.httpsCallable('listBakeryUsers')({ bakeryId })
            )
        );

        // Update bakeryId for the user add fab
        this.bakeryIdSubscription = this.bakeryId$.subscribe((bakeryId) => {
            this.bakeryAdminUserAddFabService.showButton(bakeryId);
        });

        this.bakerySubscription = this.bakery$.subscribe((bakery) => {
            this.titleService.setTitle(`Admin: ${bakery.name}`);
            this.settingsFormGroup.patchValue({
                name: bakery.name,
                description: bakery.description,
            });
        });
    }

    // Force destroy component on route change
    @HostListener('unloaded')
    ngOnDestroy(): void {
        this.bakeryAdminUserAddFabService.hideButton();
        this.bakeryIdSubscription.unsubscribe();
        this.bakerySubscription.unsubscribe();
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

    async saveSettings() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            const callable = this.fns.httpsCallable('editBakery');
            await callable({
                ...this.settingsFormGroup.value,
                bakeryId: this.bakeryAdminUserAddFabService.bakeryId,
            }).toPromise();
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
