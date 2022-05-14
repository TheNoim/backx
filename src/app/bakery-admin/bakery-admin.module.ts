import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BakeryAdminComponent } from './bakery-admin.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [BakeryAdminComponent],
  exports: [BakeryAdminComponent]
})
export class BakeryAdminComponentModule {}
