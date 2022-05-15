import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeEditFabComponent } from './recipe-edit-fab.component';
import { RecipeEditFabService } from './recipe-edit-fab.service';
import { RecipeEditFormModule } from '../recipe-edit-form/recipe-edit-form.module';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RecipeEditFormModule],
    declarations: [RecipeEditFabComponent],
    exports: [RecipeEditFabComponent],
    providers: [RecipeEditFabService],
})
export class RecipeEditFabComponentModule {}
