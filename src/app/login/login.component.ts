import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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

    loading = false;

    error: string | null = null;

    constructor(public auth: AngularFireAuth, private router: Router) {}

    async login() {
        this.loading = true;
        try {
            await this.auth.signInWithEmailAndPassword(
                this.loginGroup.get('email').value,
                this.loginGroup.get('password').value
            );
            await this.router.navigateByUrl('/');
        } catch (e) {
            this.error = e?.message ?? 'An unknown error occured';
        } finally {
            this.loading = false;
        }
    }
}
