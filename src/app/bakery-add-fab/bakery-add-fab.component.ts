import { Component, OnInit } from '@angular/core';
import { BakeryAddFabServiceService } from './bakery-add-fab-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import {
    AlertController,
    IonRouterOutlet,
    LoadingController,
} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-bakery-add-fab',
    templateUrl: './bakery-add-fab.component.html',
    styleUrls: ['./bakery-add-fab.component.scss'],
})
export class BakeryAddFabComponent implements OnInit {
    addModalOpen = false;

    addBakeryForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    });

    constructor(
        public bakeryAddFabService: BakeryAddFabServiceService,
        private fns: AngularFireFunctions,
        public routerOutlet: IonRouterOutlet,
        public loadingController: LoadingController,
        public alertController: AlertController,
        private router: Router
    ) {}

    ngOnInit() {}

    openModal() {
        this.addBakeryForm.reset();
        this.addModalOpen = true;
    }

    async submit() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            const callable = this.fns.httpsCallable('createBakery');
            const { id } = await callable(this.addBakeryForm.value).toPromise();
            this.dismissModal();
            await this.router.navigateByUrl(`/bakery/admin/${id}`);
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
