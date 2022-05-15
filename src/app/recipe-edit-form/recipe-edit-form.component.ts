import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Ingredient, Recipe, VALID_UNITS } from '../interfaces';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
    AlertController,
    LoadingController,
    ModalController,
} from '@ionic/angular';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Component({
    selector: 'app-recipe-edit-form',
    templateUrl: './recipe-edit-form.component.html',
    styleUrls: ['./recipe-edit-form.component.scss'],
})
export class RecipeEditFormComponent implements OnInit, OnDestroy {
    @Input() recipeId?: string;
    @Input() bakeryId: string;

    recipeFormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        shortDescription: new FormControl(''),
        ingredients: new FormArray([]),
        steps: new FormArray([]),
    });

    recipeSubscription?: Subscription;

    loading?: HTMLIonLoadingElement;

    constructor(
        private afs: AngularFirestore,
        public loadingController: LoadingController,
        private modalController: ModalController,
        private alertController: AlertController,
        private fns: AngularFireFunctions
    ) {}

    async ngOnInit() {
        // Load existing recipe and apply to current FormGroup
        if (this.recipeId) {
            this.loading = await this.loadingController.create({
                message: 'Please wait...',
            });
            await this.loading.present();
            this.recipeSubscription = this.afs
                .doc<Recipe>(`recipe/${this.recipeId}`)
                .valueChanges()
                .subscribe((recipe) => {
                    this.patchValues(recipe);
                    this.loading.dismiss();
                });
        }
    }

    async ngOnDestroy() {
        if (this.recipeSubscription) {
            this.recipeSubscription.unsubscribe();
        }
        if (this.loading) {
            await this.loading.dismiss();
        }
    }

    /* Save as new recipe or create new one */
    async submit() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();
        try {
            const callable = this.fns.httpsCallable('createOrEditRecipe');
            await callable({
                bakeryId: this.bakeryId,
                recipeId: this.recipeId,
                recipe: this.recipeFormGroup.value,
            }).toPromise();
        } catch (e) {
            console.log({ e });

            const alert = await this.alertController.create({
                header: 'Error',
                message: e?.message ?? 'An unknown error occurred',
                buttons: ['OK'],
            });

            await alert.present();
        } finally {
            await loading.dismiss();
        }
    }

    patchValues(recipe: Recipe) {
        const { ingredients, steps, ...stringValues } = recipe;

        this.recipeFormGroup.patchValue({
            ...stringValues,
        });

        this.clearFormArray(this.getFormArray('steps'));
        this.clearFormArray(this.getFormArray('ingredients'));

        steps
            .map((step) => this.generateStepFormController(step))
            .forEach((controller) => {
                this.getFormArray('steps').push(controller);
            });

        ingredients
            .map((ingredient) => this.generateIngredientFormGroup(ingredient))
            .forEach((controller) => {
                this.getFormArray('ingredients').push(controller);
            });
    }

    clearFormArray(formArray: FormArray) {
        for (let i = formArray.controls.length - 1; i >= 0; i--) {
            formArray.removeAt(i);
        }
    }

    getFormArray(forKey: string): FormArray {
        return this.recipeFormGroup.get(forKey) as FormArray;
    }

    getFormControllerByKey(
        forKey: string,
        fromAbstractController: AbstractControl
    ): FormControl {
        return fromAbstractController.get(forKey) as FormControl;
    }

    getFormController(fromAbstractController: AbstractControl): FormControl {
        return fromAbstractController as FormControl;
    }

    removeFormArrayController(forKey: string, atIndex: number) {
        (this.recipeFormGroup.get(forKey) as FormArray).removeAt(atIndex);
    }

    /**
     * Add new ingredient FormController
     */
    addIngredient() {
        (this.recipeFormGroup.get('ingredients') as FormArray).push(
            this.generateIngredientFormGroup()
        );
    }

    /**
     * Add new step FormController
     */
    addStep() {
        (this.recipeFormGroup.get('steps') as FormArray).push(
            this.generateStepFormController()
        );
    }

    /**
     * Generate a new FormController for a recipe step
     *
     * @param step
     */
    generateStepFormController(step: string = '') {
        return new FormControl(step, Validators.required);
    }

    /**
     * Generates a new FormGroup from an ingredient object
     *
     * @param ingredient
     */
    generateIngredientFormGroup(
        ingredient: Ingredient = { count: 0, name: '', unit: 'g' }
    ) {
        return new FormGroup({
            count: new FormControl(ingredient.count, [
                Validators.min(0),
                Validators.required,
            ]),
            name: new FormControl(ingredient.name, [
                Validators.required,
                Validators.minLength(2),
            ]),
            unit: new FormControl(ingredient.unit, [
                Validators.required,
                // Validate list of known units
                (control: AbstractControl) =>
                    VALID_UNITS.includes(control.value)
                        ? null
                        : { unknownUnit: { value: control.value } },
            ]),
        });
    }

    async dismissModal() {
        await this.modalController.dismiss();
    }
}
