import { model, Model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  username: string;
  role: string;
  followed_shows: number[];
}

const IUserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    username: {
    type: String,
    required: true,
    index: true,
    unique: true
    },
    password: { type: String, required: true },
    role: { type: String, required: true },
    followed_shows: { type: [Number], required: true}
  },
  { collection: 'user', timestamps: true }
);

export const UserModel: Model<IUser> = model('user', IUserSchema);