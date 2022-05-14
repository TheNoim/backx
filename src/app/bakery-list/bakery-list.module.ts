import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BakeryListComponent } from './bakery-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule],
    declarations: [BakeryListComponent],
    exports: [BakeryListComponent],
})
export class BakeryListComponentModule {}
