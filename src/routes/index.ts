import { Router } from "express";
import MainRouter from "./main";
import TopRouter from "./top";

const router = Router();

router.use("/", MainRouter);
router.use("/top", TopRouter);

export default router;