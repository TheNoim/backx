import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Bakery, UserSettings } from '../../src/app/interfaces';
import uniq from 'lodash.uniq';
import { firestore } from 'firebase-admin';
import DocumentSnapshot = firestore.DocumentSnapshot;
import {
    bakeryManagementCheck,
    resolveUserSettingForUserId,
    userEmailRequestCheck,
} from './lib';

const db = admin.firestore();

/* Save user mail in user collection */
export const saveUserEmailInSettings = functions
    .region('europe-west1')
    .auth.user()
    .onCreate(async (user) => {
        await db.collection('user').doc(user.uid).set({
            email: user.email,
            fullName: user.displayName,
            bakeries: [],
        });
    });

/** Add our bakery id to userSettings **/
export const updateUserBakeriesOnBakeryCreate = functions
    .region('europe-west1')
    .firestore.document('bakery/{docId}')
    .onCreate(async (snapshot) => {
        const data = snapshot.data() as unknown as Bakery;
        // User list of the bakery user's
        const users = uniq([...(data.users ?? []), ...(data.admins ?? [])]);

        // For each user add the bakery id to user settings collection
        await Promise.all(
            users.map(async (user) => {
                const userSettings: DocumentSnapshot<UserSettings> = await db
                    .doc(`user/${user}`)
                    .get();

                // Only if user setting already exist. This prevents the creation of non-existing users.
                if (userSettings.exists) {
                    const userData = userSettings.data();
                    await db.doc(`user/${user}`).set({
                        ...userData,
                        bakeries: uniq([
                            ...(userData?.bakeries ?? []),
                            snapshot.id,
                        ]),
                    });
                }
            })
        );
    });

/** Add/Remove our bakery id to userSettings **/
export const updateUserBakeriesOnBakeryUpdate = functions
    .region('europe-west1')
    .firestore.document('bakery/{docId}')
    .onUpdate(async (change) => {
        const targetBakeryId = change.before.id;
        const beforeUsers = uniq([
            ...((change.before.data() as Bakery).users ?? []),
            ...((change.before.data() as Bakery).admins ?? []),
        ]);
        const afterUsers = uniq([
            ...((change.after.data() as Bakery).users ?? []),
            ...((change.after.data() as Bakery).admins ?? []),
        ]);
        // First update remove users
        await Promise.all(
            beforeUsers.map(async (user) => {
                // User got removed
                if (afterUsers.indexOf(user) === -1) {
                    const userSettings: DocumentSnapshot<UserSettings> =
                        await db.doc(`user/${user}`).get();
                    // Only if user setting already exist.
                    if (userSettings.exists) {
                        const userData = userSettings.data();
                        await db.doc(`user/${user}`).set({
                            ...userData,
                            // Remove bakeryId of our bakery document
                            bakeries: (userData?.bakeries ?? []).filter(
                                (bakeryId) => bakeryId !== targetBakeryId
                            ),
                        });
                    }
                }
            })
        );

        // Now add new users
        await Promise.all(
            afterUsers.map(async (user) => {
                // User got added
                if (beforeUsers.indexOf(user) === -1) {
                    const userSettings: DocumentSnapshot<UserSettings> =
                        await db.doc(`user/${user}`).get();
                    // Only if user setting already exist.
                    if (userSettings.exists) {
                        const userData = userSettings.data();
                        await db.doc(`user/${user}`).set({
                            ...userData,
                            // Add new bakeryId
                            bakeries: uniq([
                                ...(userData?.bakeries ?? []),
                                targetBakeryId,
                            ]),
                        });
                    }
                }
            })
        );
    });

// List users settings for bakery
export const listBakeryUsers = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        const bakery = await bakeryManagementCheck(data, context);

        /* Resolve user settings for all users */

        const admins = (
            await Promise.all(
                bakery.admins.map((user) => resolveUserSettingForUserId(user))
            )
        ).filter((user) => !!user);

        const users = (
            await Promise.all(
                bakery.users.map((user) => resolveUserSettingForUserId(user))
            )
        ).filter((user) => !!user);

        return {
            users,
            admins,
        };
    });

export const addUserToBakery = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        const { bakeryId, ...bakery } = await bakeryManagementCheck(
            data,
            context
        );

        const user = await userEmailRequestCheck(data);

        // Add also as admin
        if (data?.admin) {
            bakery.admins = uniq([...bakery.admins, user.userId]);
        }
        bakery.users = uniq([...bakery.users, user.userId]);

        await db.doc(`bakery/${bakeryId}`).set(bakery);
    });

export const removeUserFromBakery = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        const { bakeryId, ...bakery } = await bakeryManagementCheck(
            data,
            context
        );

        const user = await userEmailRequestCheck(data);

        // Unpromote
        bakery.admins = bakery.admins.filter(
            (adminId) => adminId !== user.userId
        );
        // Remove user if this is not an unpromote request
        if (!data?.admin) {
            bakery.users = bakery.users.filter((uid) => uid !== user.userId);
        }

        // There should always be at least one admin
        if (bakery.admins.length === 0) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'You can not remove the only admin'
            );
        }

        await db.doc(`bakery/${bakeryId}`).set(bakery);
    });

export const createOrEditRecipe = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        const { bakeryId, recipe, recipeId } = data ?? {};

        // Check whether the user even has the permission to edit or create a recipe
        await bakeryManagementCheck({ bakeryId }, context);

        // Update recipe
        if (recipeId && typeof recipeId === 'string') {
            const recipeSnapshot = await db.doc(`recipe/${recipeId}`).get();
            if (!recipeSnapshot.exists) {
                throw new functions.https.HttpsError(
                    'not-found',
                    'Recipe with id ' + recipeId + ' not found.'
                );
            }
            await db.doc(`recipe/${recipeId}`).set({
                ...recipe,
                bakery: bakeryId,
            });
        } else {
            // Create new recipe
            await db.collection('recipe').add({
                ...recipe,
                bakery: bakeryId,
            });
        }

        return true;
    });
