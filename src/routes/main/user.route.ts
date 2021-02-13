import { Router } from "express";
import passport from "passport";

import Util from "../../core/util.core";

const router = Router();

router.get("/", Util.authJWT, (req, res) => {
  
  res.send(req.user);
})

export default router;