import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailViewComponent } from './recipe-detail-view.component';
import { RecipeEditFabComponentModule } from '../recipe-edit-fab/recipe-edit-fab.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RecipeEditFabComponentModule,
    ],
    declarations: [RecipeDetailViewComponent],
    exports: [RecipeDetailViewComponent],
})
export class RecipeDetailViewComponentModule {}
