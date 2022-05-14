import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BakeryComponent } from './bakery.component';
import { BakeryListComponent } from '../bakery-list/bakery-list.component';
import { BakeryListComponentModule } from '../bakery-list/bakery-list.module';
import { BakeryAdminComponentModule } from '../bakery-admin/bakery-admin.module';
import { BakeryAdminComponent } from '../bakery-admin/bakery-admin.component';

const routes: Routes = [
    {
        path: '',
        component: BakeryComponent,
        children: [
            {
                path: '',
                component: BakeryListComponent,
            },
            {
                path: 'admin/:id',
                component: BakeryAdminComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        BakeryListComponentModule,
        BakeryAdminComponentModule,
    ],
    exports: [RouterModule],
})
export class BakeryRoutingModule {}
