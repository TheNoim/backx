import { Bakery, UserSettings } from '../../src/app/interfaces';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import * as functions from 'firebase-functions';

admin.initializeApp();

const db = admin.firestore();

// Get the user setting for an userId
export const resolveUserSettingForUserId = async (
    userId: string
): Promise<UserSettings | null> => {
    const userDoc = await db.doc(`user/${userId}`).get();
    if (userDoc.exists) {
        return userDoc.data() as UserSettings;
    }
    return null;
};

// Get the user setting for an userId
export const resolveUserSettingForUserEmail = async (
    email: string
): Promise<(UserSettings & { userId: string }) | null> => {
    const userDoc = await db
        .collection('user')
        .where('email', '==', email)
        .get();
    if (userDoc.docs.length > 0) {
        const doc = userDoc.docs[0];
        const userSettings = doc.data() as UserSettings;
        return {
            userId: doc.id,
            ...userSettings,
        };
    }
    return null;
};

export const userEmailRequestCheck = async (
    data: Record<string, unknown>
): Promise<UserSettings & { userId: string }> => {
    const email = data?.userEmail;
    if (!email || typeof email !== 'string') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with an email.'
        );
    }
    const user = await resolveUserSettingForUserEmail(email);
    if (!user) {
        throw new functions.https.HttpsError(
            'not-found',
            'User with email ' + email + ' not found.'
        );
    }
    return user;
};

/* Check whether the user is allowed to edit the bakery */
export const bakeryManagementCheck = async (
    data: Record<string, unknown>,
    context: CallableContext
): Promise<Bakery & { bakeryId: string }> => {
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
    if (!bakeryId || typeof bakeryId !== 'string') {
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
            'Bakery with id ' + bakeryId + ' not found.'
        );
    }
    const bakery = bakeryDoc.data() as Bakery;
    const isUserAdmin = bakery.admins.indexOf(uid) >= 0; // Only admins should be able to list users of a bakery
    if (!isUserAdmin) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'You are not admin of this bakery.'
        );
    }

    return {
        ...bakery,
        bakeryId,
    };
};
