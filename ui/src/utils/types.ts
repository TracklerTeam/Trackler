export interface IUser {
    _id: string;
    email: string;
    username: string;
    role: string;
    followed_shows: number[];
}

export interface IUserStore {
    user: IUser;
    isAuthenticated: boolean;
}