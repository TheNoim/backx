import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate } from '@angular/fire/compat/auth-guard';
import {
    redirectLoggedInTo,
    redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectLoggedInToItems = () => redirectLoggedInTo(['bakeries']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
    {
        path: '',
        redirectTo: 'bakery',
        pathMatch: 'full',
    },
    {
        path: 'login',
        ...canActivate(redirectLoggedInToItems),
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginComponentModule),
    },
    {
        path: 'bakery',
        ...canActivate(redirectUnauthorizedToLogin),
        loadChildren: () =>
            import('./bakery/bakery.module').then(
                (m) => m.BakeryComponentModule
            ),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
