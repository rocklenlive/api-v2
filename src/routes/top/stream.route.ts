import { Router } from "express";
import passport from "passport";

import User from "../../models/user.model";
import Util from "../../core/util.core";

const router = Router();


router.get("/", Util.authJWT, (req, res, next) => {
  
  User.find().then((users) => {
    // supplying the whole user data wouldn't be a good idea!
    let newUsers = users.map(user => ({id: user.id, username: user.username, discriminator: user.discriminator, time: user.stream.time}))
    .sort((userA, userB) => userB.time - userA.time)
    .slice(0, 10);
    res.send(newUsers);
  }).catch(() => {
    res.status(500).send({
      code: 500,
      message: "USERS_FROM_DB_FAILED"
    });
  })
})

export default router;