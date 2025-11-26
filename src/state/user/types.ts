export type User = {
    id: string;
    email: string;
    displayName: string;
};

export type UserState = {
    currentUser: User | null;
};
