import { Router } from "express";
import MainRouter from "./main";

const router = Router();

router.use(MainRouter);

export default router;