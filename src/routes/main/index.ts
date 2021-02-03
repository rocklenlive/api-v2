import { Router } from "express";
import UserRoute from "./user.route";
import CallbackRoute from "./callback.route";

const router = Router();


router.use("/user", UserRoute);

router.use("/callback", CallbackRoute);


export default router;