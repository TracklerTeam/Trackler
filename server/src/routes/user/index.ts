import express from "express";
import ShowRouter from './show';

const router = express.Router();
router.use('/show', ShowRouter);

export default router;