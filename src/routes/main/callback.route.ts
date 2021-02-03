import { Router } from "express";
import passport from "passport";
import Discord from "passport-discord";

import Util from "../../core/util.core";

const router = Router();

router.get("/", passport.authenticate("discord", {
  session: false,
}), (req, res) => {
  try {
    let user = req.user as Discord.Profile;
    if(user) {
      res.send({
        token: Util.createToken(user.id)
      });
    } else {
      // passport-discord will take care of authenticating with discord
      res.sendStatus(204);
    } 
  } catch(e) {
    res.sendStatus(500);
  }
});

export default router;