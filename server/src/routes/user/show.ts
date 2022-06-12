import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../utils/middleware/auth";
import { IUser, UserModel } from "../../database/schema/userSchema";
import axios from 'axios';

const router = Router();

router.get('/getFollowed', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ _id: req.body.tokenData._id });

    res.send(user.followed_shows);
});

router.get('/follow/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ _id: req.body.tokenData._id });

    if (isNaN(Number(req.params.id)))
        return res.status(400).send({ error: 'Invalid show id' });

    if(user.followed_shows.includes(Number(req.params.id)))
        return res.status(400).send({ error: 'Show already followed', followed_shows: user.followed_shows });

    user.followed_shows.push(Number(req.params.id));
    await user.save();
    res.send(user.followed_shows);
});

router.get('/unfollow/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ _id: req.body.tokenData._id });

    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({ error: 'Invalid show id' });
    }

    const index = user.followed_shows.indexOf(Number(req.params.id));
    if (index > -1) {
        user.followed_shows.splice(index, 1);
    } else {
        return res.status(400).send({ error: 'Show not found' });
    }
    await user.save();
    res.send(user.followed_shows);
});

export default router;