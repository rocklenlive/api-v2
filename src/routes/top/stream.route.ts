import { Router } from "express";
import User from "../../models/user.model";

const router = Router();

router.get("/", (req, res) => {
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
});

export default router;