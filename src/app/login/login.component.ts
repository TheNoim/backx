import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    loginGroup = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(
        public auth: AngularFireAuth,
        private router: Router,
        public loadingController: LoadingController,
        public alertController: AlertController
    ) {}

    async login() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            await this.auth.signInWithEmailAndPassword(
                this.loginGroup.get('email').value,
                this.loginGroup.get('password').value
            );
            this.loginGroup.reset();
            await this.router.navigateByUrl('/');
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

    async signup() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            await this.auth.createUserWithEmailAndPassword(
                this.loginGroup.get('email').value,
                this.loginGroup.get('password').value
            );
            this.loginGroup.reset();
            await this.router.navigateByUrl('/');
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
