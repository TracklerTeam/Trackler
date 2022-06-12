import express from "express";
import AuthRouter from './auth';
import SearchRouter from './search';

const router = express.Router();
router.use("/auth", AuthRouter);
router.use('/search', SearchRouter);
export default router;