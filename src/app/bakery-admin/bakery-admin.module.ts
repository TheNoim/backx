import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BakeryAdminComponent } from './bakery-admin.component';
import { BakeryAdminUserAddFabComponentModule } from '../bakery-admin-user-add-fab/bakery-admin-user-add-fab.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BakeryAdminUserAddFabComponentModule,
    ],
    declarations: [BakeryAdminComponent],
    exports: [BakeryAdminComponent],
})
export class BakeryAdminComponentModule {}
