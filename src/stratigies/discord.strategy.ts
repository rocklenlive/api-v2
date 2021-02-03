import type { VerifyCallback } from "passport-oauth2";
import Discord from "passport-discord";

import User from "../models/user.model";

const DiscordStrategy = new Discord.Strategy({
  clientID: process.env.DISCORD_CLIENT_ID as string,
  clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
  callbackURL: process.env.CALLBACK_URL as string,
  scope: ["email", "identify"]
}, (accessToken: string, refreshToken: string, profile: Discord.Profile, done: VerifyCallback) => {
  User.findOneAndUpdate({
    id: profile.id
  }, {
    username: profile.username,
    discriminator: profile.discriminator,
    avatar: profile.avatar,
    email: profile.email || null
  }).then(async user => {
    if(!user) {
      let newUser = await User.create({
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        email: profile.email || null
      });
      newUser.save();
    };
    done(null, profile);
  }).catch((error) => {
    done(error, undefined);
  })
});

export default DiscordStrategy;