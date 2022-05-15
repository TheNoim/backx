import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeListComponent } from './recipe-list.component';
import { RecipeListService } from './recipe-list.service';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [RecipeListComponent],
    exports: [RecipeListComponent],
    providers: [RecipeListService],
})
export class RecipeListComponentModule {}