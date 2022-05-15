import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BakeryComponent } from './bakery.component';
import { BakeryListComponent } from '../bakery-list/bakery-list.component';
import { BakeryListComponentModule } from '../bakery-list/bakery-list.module';
import { BakeryAdminComponentModule } from '../bakery-admin/bakery-admin.module';
import { BakeryAdminComponent } from '../bakery-admin/bakery-admin.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { RecipeListComponentModule } from '../recipe-list/recipe-list.module';
import { RecipeDetailViewComponent } from '../recipe-detail-view/recipe-detail-view.component';
import { RecipeDetailViewComponentModule } from '../recipe-detail-view/recipe-detail-view.module';

const routes: Routes = [
    {
        path: '',
        component: BakeryComponent,
        children: [
            {
                path: '',
                component: BakeryListComponent,
            },
            {
                path: 'admin/:id',
                component: BakeryAdminComponent,
            },
            {
                path: ':id/recipes',
                component: RecipeListComponent,
            },
            {
                path: ':id/recipes/:recipeId',
                component: RecipeDetailViewComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        BakeryListComponentModule,
        BakeryAdminComponentModule,
        RecipeListComponentModule,
        RecipeDetailViewComponentModule,
    ],
    exports: [RouterModule],
})
export class BakeryRoutingModule {}
