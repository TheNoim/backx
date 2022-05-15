import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BakeryAddFabComponent } from './bakery-add-fab.component';
import { BakeryAddFabServiceService } from './bakery-add-fab-service.service';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
    declarations: [BakeryAddFabComponent],
    exports: [BakeryAddFabComponent],
    providers: [BakeryAddFabServiceService],
})
export class BakeryAddFabComponentModule {}
