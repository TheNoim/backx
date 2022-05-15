import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BakeryAdminUserAddFabService } from './bakery-admin-user-add-fab.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import {
    AlertController,
    IonRouterOutlet,
    LoadingController,
} from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-bakery-admin-user-add-fab',
    templateUrl: './bakery-admin-user-add-fab.component.html',
    styleUrls: ['./bakery-admin-user-add-fab.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class BakeryAdminUserAddFabComponent implements OnInit {
    addModalOpen = false;
    addAsAdmin = false;

    addUserForm = new FormGroup({
        email: new FormControl(''),
    });

    constructor(
        public bakeryAdminUserAddFabService: BakeryAdminUserAddFabService,
        private fns: AngularFireFunctions,
        public routerOutlet: IonRouterOutlet,
        public loadingController: LoadingController,
        public alertController: AlertController
    ) {}

    ngOnInit() {}

    openModal(asAdmin?: boolean) {
        this.addUserForm.reset();
        this.addAsAdmin = asAdmin ?? false;
        this.addModalOpen = true;
    }

    async submit() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            const callable = this.fns.httpsCallable('addUserToBakery');
            await callable({
                userEmail: this.addUserForm.get('email').value,
                admin: this.addAsAdmin,
                bakeryId: this.bakeryAdminUserAddFabService.bakeryId,
            }).toPromise();
            this.bakeryAdminUserAddFabService.reloadUserData();
            this.dismissModal();
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

    dismissModal() {
        this.addModalOpen = false;
    }
}
