import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BakeryComponent } from './bakery.component';
import { BakeryRoutingModule } from './bakery-routing.module';
import { BakeryAdminUserAddFabComponentModule } from '../bakery-admin-user-add-fab/bakery-admin-user-add-fab.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BakeryRoutingModule,
        BakeryAdminUserAddFabComponentModule,
    ],
    declarations: [BakeryComponent],
    exports: [BakeryComponent],
})
export class BakeryComponentModule {}
