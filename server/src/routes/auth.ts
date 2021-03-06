import { Router, Request, Response, NextFunction } from "express";
import { IUser, UserModel  } from '../database/schema/userSchema';
import { ulid } from 'ulid';
import { passwordHash, comparePassword } from "../utils/password";
import { generateAuthToken } from "../utils/jwt";
import { authMiddleware } from "../utils/middleware/auth";

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    const userExists = await UserModel.findOne({ username });
    if (!!userExists) {
        return res.status(400).send({ error: 'Username is already taken.' });
    }


    const hash = passwordHash(password);
    const newUser: IUser = {
      _id: ulid(),
      email,
      username,
      password: hash,
      role: "user",
      followed_shows: []
    };

    await UserModel.create(newUser);

    console.log(`User '${username}' successfully registered.`);
    res.send({ done: true });
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
    }

    const userExists = await UserModel.findOne({ username });
    if (!userExists) {
        return res.status(401).send({ error: 'User not found' });
    }

    const validPassword = comparePassword(password, userExists.password);
    if (!validPassword) {
        return res.status(401).send({ error: 'Invalid password' });
    }

    const token = generateAuthToken(userExists);

    const sendUser = userExists.toJSON();
    res.send({ token,  user: { ...sendUser, password: '' } });
    console.log(`User '${username}' successfully logged in.`);
});

router.get('/isLogged', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    res.send("You are logged in!");
});

export default router;