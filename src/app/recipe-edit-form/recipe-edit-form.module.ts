import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecipeEditFormComponent } from './recipe-edit-form.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
    declarations: [RecipeEditFormComponent],
    exports: [RecipeEditFormComponent],
})
export class RecipeEditFormModule {}
