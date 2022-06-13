import { model, Model, Schema } from 'mongoose';

export interface IShowUser {
    _id: string;
    show_id: string;
    user_id: string;
    watchedEpisodes: string[];
};

const IShowUserSchema = new Schema<IShowUser>(
{
    _id: { type: String, required: true },
    show_id: { type: String, required: true },
    user_id: { type: String, required: true },
    watchedEpisodes: { type: [String], required: false }
},
{ collection: 'showUser', timestamps: true }
);

export const ShowUserModel: Model<IShowUser> = model('showUser', IShowUserSchema);