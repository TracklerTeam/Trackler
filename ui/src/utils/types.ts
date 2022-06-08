export interface IUser {
    _id: string;
    email: string;
    username: string;
    role: string;
}

export interface IUserStore {
    user: IUser;
    isAuthenticated: boolean;
}