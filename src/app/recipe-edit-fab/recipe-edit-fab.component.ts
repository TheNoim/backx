import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecipeEditFabService } from './recipe-edit-fab.service';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { RecipeEditFormComponent } from '../recipe-edit-form/recipe-edit-form.component';

@Component({
    selector: 'app-recipe-edit-fab',
    templateUrl: './recipe-edit-fab.component.html',
    styleUrls: ['./recipe-edit-fab.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class RecipeEditFabComponent implements OnInit {
    constructor(
        public recipeEditFabService: RecipeEditFabService,
        private modalController: ModalController,
        private routerOutlet: IonRouterOutlet
    ) {}

    ngOnInit() {}

    async editOrCreate() {
        const editOrCreateModal = await this.modalController.create({
            component: RecipeEditFormComponent,
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
            componentProps: {
                recipeId: this.recipeEditFabService.recipeId,
                bakeryId: this.recipeEditFabService.bakeryId,
            },
        });
        return await editOrCreateModal.present();
    }
}
