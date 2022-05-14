import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BakeryComponent } from './bakery.component';
import { BakeryListComponent } from '../bakery-list/bakery-list.component';
import { BakeryListComponentModule } from '../bakery-list/bakery-list.module';

const routes: Routes = [
    {
        path: '',
        component: BakeryComponent,
        children: [
            {
                path: '',
                component: BakeryListComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), BakeryListComponentModule],
    exports: [RouterModule],
})
export class BakeryRoutingModule {}
