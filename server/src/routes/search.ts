import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../utils/middleware/auth";
import axios from 'axios';

const router = Router();

router.get('/multi/:query/:page', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    let response = null;

    try {
        response = await axios.get(`${process.env.TMDB_URL}/search/tv?api_key=${process.env.TMDB_KEY}&query=${req.params.query}&page=${req.params.page}&include_adult=false`)
    } catch (err) {
        return res.status(500).send({ error: 'Something went wrong' });
    }

    res.send(response.data);
});

export default router;