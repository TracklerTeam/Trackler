import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../utils/middleware/auth";
import { IShow, ShowModel } from "../database/schema/showSchema";
import { addShow } from "../utils/show";
import axios from 'axios';
import moment from "moment";

const router = Router();

router.get('/getShow/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const show = await ShowModel.findOne({ _id: req.params.id });

    if(!show) {
        try {
            const response = await addShow(req.params.id);

            return res.status(200).json(response);
        } catch (err) {
            return res.status(500).send({ error: 'Something went wrong' });
        }
    } else if(moment(show.updatedAt).isBefore(moment().subtract(1, 'day'))) {
        try {
            show.delete();
            const response = await addShow(req.params.id);

            return res.status(200).json(response);
        } catch (err) {
            return res.status(500).send({ error: 'Something went wrong' });
        }
    } else {
        return res.status(200).json(show);
    }
});

export default router;