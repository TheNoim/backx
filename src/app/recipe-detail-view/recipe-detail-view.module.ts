import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailViewComponent } from './recipe-detail-view.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [RecipeDetailViewComponent],
  exports: [RecipeDetailViewComponent]
})
export class RecipeDetailViewComponentModule {}
