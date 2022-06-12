import express from "express";
import AuthRouter from './auth';
import SearchRouter from './search';
import UserRouter from './user';

const router = express.Router();
router.use("/auth", AuthRouter);
router.use('/search', SearchRouter);
router.use('/user', UserRouter);
export default router;