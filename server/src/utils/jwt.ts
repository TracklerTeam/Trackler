import { IUser } from '../database/schema/userSchema';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const jwtKey = process.env.JWT_KEY;

export const generateAuthToken = (user: IUser): string => {
  const token = jwt.sign({ _id: user._id, username: user.username }, jwtKey, {
    expiresIn: '2h',
  });

  return token;
};

export const verifyToken = (token: string): { _id: string; username: string } => {
  try {
    const tokenData = jwt.verify(token, jwtKey);
    return tokenData as { _id: string; username: string };
  } catch (error) {
    throw new Error("Invalid token");
  }
};