import { UserSettings } from '../../src/app/interfaces';
import * as admin from 'firebase-admin';

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
