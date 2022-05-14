export interface UserSettings {
    fullName?: string;
    email?: string;
    bakeries?: string[];
}

export type User = UserSettings & {
    uid: string;
    email: string;
};

export interface BakeryUserListFunctionResponse {
    admins: UserSettings[];
    users: UserSettings[];
}
