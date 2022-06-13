import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../utils/middleware/auth";
import { IUser, UserModel } from "../../database/schema/userSchema";
import { IShowUser, ShowUserModel } from "../../database/schema/showUserSchema";
import { IShow, ShowModel } from '../../database/schema/showSchema';
import { ulid } from 'ulid';
import { addShow } from "../../utils/show";

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

    const showUser : IShowUser = {
        _id: ulid(),
        user_id: user._id,
        show_id: req.params.id,
        watchedEpisodes: []
    };

    user.followed_shows.push(Number(req.params.id));
    await user.save();
    res.send(user.followed_shows);
    ShowUserModel.create(showUser);
});

router.get('/unfollow/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ _id: req.body.tokenData._id });
    const showUser = await ShowUserModel.findOne({ user_id: user._id, show_id: req.params.id });

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

    if(showUser)
        showUser.remove();
});

router.get('/:id/getWatched', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const showUser = await ShowUserModel.findOne({ user_id: req.body.tokenData._id, show_id: req.params.id });

    if(!showUser)
        return res.status(400).send({ error: 'Show not found or not followed' });

    res.send(showUser.watchedEpisodes);
});

router.get('/:id/watch/:episode', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    let showUser = await ShowUserModel.findOne({ user_id: req.body.tokenData._id, show_id: req.params.id });

    if(!showUser) {
        const showUserData : IShowUser = {
            _id: ulid(),
            user_id: req.body.tokenData._id,
            show_id: req.params.id,
            watchedEpisodes: []
        };

        showUser = await ShowUserModel.create(showUserData);
    }

    if(isNaN(Number(req.params.episode)))
        return res.status(400).send({ error: 'Invalid episode id' });

    if(showUser.watchedEpisodes.includes(req.params.episode))
        return res.status(400).send({ error: 'Episode already watched' });

    showUser.watchedEpisodes.push(req.params.episode);
    await showUser.save();
    res.send(showUser.watchedEpisodes);
});

router.get('/:id/unwatch/:episode', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const showUser = await ShowUserModel.findOne({ user_id: req.body.tokenData._id, show_id: req.params.id });

    if(!showUser)
        return res.status(400).send({ error: 'Show not found or not followed' });

    const index = showUser.watchedEpisodes.indexOf(req.params.episode);
    if (index > -1) {
        showUser.watchedEpisodes.splice(index, 1);
    } else {
        return res.status(400).send({ error: 'Episode not found' });
    }

    await showUser.save();
    res.send(showUser.watchedEpisodes);
});

router.get('/:id/getUnwatched', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    let show = await ShowModel.findOne({ _id: req.params.id });

    if(!show) {
        try {
            show = await addShow(req.params.id);
        } catch(error) {
            return res.status(400).send({ error: 'Show not found' });
        }
    }

    const episodes = [];
    for(const season of show.seasons)
        for(const episode of season.episodes)
            episodes.push(episode._id);

    const showUser = await ShowUserModel.findOne({ user_id: req.body.tokenData._id, show_id: req.params.id });
    if(!showUser)
        return res.status(200).send(episodes);

    return res.status(200).send(episodes.filter(episode => !showUser.watchedEpisodes.includes(episode)));


});

router.get('/:id/nextEpisode', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    let show = await ShowModel.findOne({ _id: req.params.id });

    if(!show) {
        try {
            show = await addShow(req.params.id);
        } catch(error) {
            return res.status(400).send({ error: 'Show not found' });
        }
    }

    const showUser = await ShowUserModel.findOne({ user_id: req.body.tokenData._id, show_id: req.params.id });
    if(!showUser)
        return res.status(400).send({ error: 'Show not followed' });

    let nextEpisode = null;
    for(const season of show.seasons) {
        for(const episode of season.episodes) {
            if(!showUser.watchedEpisodes.includes(episode._id)) {
                nextEpisode = episode;
                break;
            }
        }
        if(nextEpisode)
            break;
    }

    if(!nextEpisode)
        return res.status(400).send({ error: 'No next episode' });

    res.send(nextEpisode);
});

router.get('/:id/getPercentageWatched', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    let show = await ShowModel.findOne({ _id: req.params.id });

    if(!show) {
        try {
            show = await addShow(req.params.id);
        } catch(error) {
            return res.status(400).send({ error: 'Show not found' });
        }
    }

    const showUser = await ShowUserModel.findOne({ user_id: req.body.tokenData._id, show_id: req.params.id });
    if(!showUser)
        return res.status(400).send({ error: 'Show not followed' });

    let watchedEpisodes = 0;
    let totalEpisodes = 0;
    for(const season of show.seasons) {
        for(const episode of season.episodes) {
            totalEpisodes++;

            if(showUser.watchedEpisodes.includes(episode._id))
                watchedEpisodes++;
        }
    }

    const percentage = Math.round((watchedEpisodes / totalEpisodes) * 100);
    res.send({ percentage });
});

export default router;