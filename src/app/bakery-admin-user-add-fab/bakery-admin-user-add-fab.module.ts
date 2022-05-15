import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BakeryAdminUserAddFabComponent } from './bakery-admin-user-add-fab.component';
import { BakeryAdminUserAddFabService } from './bakery-admin-user-add-fab.service';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
    declarations: [BakeryAdminUserAddFabComponent],
    exports: [BakeryAdminUserAddFabComponent],
    providers: [BakeryAdminUserAddFabService],
})
export class BakeryAdminUserAddFabComponentModule {}
