# BackX

An Angular + Ionic + Firebase playground project.

## Task description

### Sub Tasks

Create a prototype with the following functions:

- User Login / User Signup
- Creation / Administration of multiple bakeries
- Creation / Administration of recipes associated with a bakery

Target: Cloud WebApp

### Technologies to use

- JS Framework: Angular
- UI: Ionic
- Backend: Firebase
- Data-management: rxjs

## Project structure

### Cloud Functions

```
root/
├─ functions/
│  ├─ src/
│  │  ├─ index.ts
```

The cloud functions are the serverless backend of this app. They perform complex or sensitive functions like creation or editing of bakeries.

List of cloud functions:

- `saveUserEmailInSettings`: Update the user settings collection with the user email
- `updateUserBakeriesOnBakeryCreate`: Keep the bakery array in the user settings collection in sync with bakeries
- `updateUserBakeriesOnBakeryUpdate`: Same task as `updateUserBakeriesOnBakeryCreate`
- `listBakeryUsers`: Resolve users with email for a specific bakery. We need this because by default you can not list users.
- `addUserToBakery`: Add a user to a specific bakery. Can also promote a user to admin status.
- `removeUserFromBakery`: Remove a user from a specific bakery. Can also demote a user.
- `createOrEditRecipe`: Edit a specific recipe or create it if it does not exist.
- `deleteRecipe`: Delete a specific recipe
- `deleteBakery`: Delete a specific bakery
- `createBakery`: Crete a new bakery for the authenticated user
- `editBakery`: Edit a specific bakery

All functions check whether the user has the permission to perform a certain action.

### Components

The components are located inside the app folder along the main app module.

```yaml
root/
├─ src/
│  ├─ app/
```

#### Route components

- bakery-list: Lists all bakeries of the logged-in user
- bakery-admin: Administration panel for a bakery
- login: Login page with user signup
- recipe-detail-view: Detail view for a recipe
- recipe-list: Lists all recipes for a bakery

#### Fab components

Because the layout of ionic requires the header FAB button to be along the header, we need to create special FAB components for each Edit or Add button.

- bakery-add-fab: Only active on the bakery-list page
- bakery-admin-user-add-fab: Only active on the bakery-admin panel
- recipe-edit-fab: Active for both the recipe list and recipe detail view

#### Other components

- recipe-edit-form: Edit / Create form for a recipe. Gets triggered by recipe-edit-fab
- app: Bootstrap app component required by angular

#### Routing

All routes except login are grouped together via the nested group function from angular router.

You can find the nested route structure inside bakery-routing.module.ts

## Project setup

### Angular

You need to install the angular cli and run `npm install` in the project root folder. Obvious, for this you need a nodejs setup.

After the firebase setup you should be able to build the application with `ng build --configuration production`.

For development, you can use `ng serve`

### Firebase

You need a firebase cli setup and firebase project with cloud functions enabled. After you have done this, you need to create `src/environments/environments.ts` and `src/environments/environments.prod.ts`. For this, you can use `src/environments/environments.example.ts` as template. In addition, you need to setup a `.firebaserc` config in the project root folder.

_Note_: You need to enable the E-Mail/Password auth provider in firebase.

_Note_: Do not forget to run `npm install` in the functions' directory.

#### Functions deployment

`firebase deploy --only functions`

#### Firestore rule setup

`firebase deploy --only firestore`

#### Hosting

_Note_: Build angular first with `ng build --configuration production`

`firebase deploy --only hosting`
