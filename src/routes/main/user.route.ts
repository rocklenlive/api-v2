import { Router } from "express";
import passport from "passport";

import Util from "../../core/util.core";

const router = Router();

router.get("/", (req, res, next) => {
  if(!Util.authJWT(req, res, next)) return;
  
  res.send(req.user);
})

export default router;