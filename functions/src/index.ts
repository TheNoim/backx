import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Bakery, UserSettings } from '../../src/app/interfaces';
import uniq from 'lodash.uniq';
import { firestore } from 'firebase-admin';
import DocumentSnapshot = firestore.DocumentSnapshot;
import { resolveUserSettingForUserId } from './lib';

const db = admin.firestore();

/* Save user mail in user collection */
export const saveUserEmailInSettings = functions
    .region('europe-west1')
    .auth.user()
    .onCreate(async (user) => {
        await db.collection('user').add({
            id: user.uid,
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
        const uid = context.auth?.uid;
        // Only authenticated users
        if (!uid) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'The function must be called while authenticated.'
            );
        }
        const bakeryId = data?.bakeryId;
        // Requires bakeryId
        if (!bakeryId) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'The function must be called with a bakeryId.'
            );
        }
        const bakeryDoc = await db.doc(`bakery/${bakeryId}`).get();
        // Check whether the bakery exists
        if (!bakeryDoc.exists) {
            throw new functions.https.HttpsError(
                'not-found',
                'Bakery with id ' + bakeryId + ' not found'
            );
        }
        const bakery = bakeryDoc.data() as Bakery;
        const isUserAdmin = bakery.admins.indexOf(uid) >= 0;
        // Only admins should be able to list users of a bakery
        if (!isUserAdmin) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'You are not admin of this bakery.'
            );
        }

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