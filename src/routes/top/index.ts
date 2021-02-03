import { Router } from "express";
import CoinsRoute from "./coins.route";
import StreamRoute from "./stream.route";

const router = Router();


router.use("/coins", CoinsRoute);
router.use("/stream", StreamRoute)


export default router;