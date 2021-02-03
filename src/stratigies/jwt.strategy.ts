import passportJWT from "passport-jwt";

import type { VerifyCallback } from "passport-oauth2";
import { JWTPayload } from "../types";

import User from "../models/user.model";

let JWTStrategy = new passportJWT.Strategy({
  jwtFromRequest: (req) => {
    let token = null;
    if(req.headers.authorization) {
      token = req.headers.authorization;
    };
    return token;
  },
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string
}, (payload: JWTPayload, done: VerifyCallback) => {
  try {
    User.findOne({
      id: payload.sub
    }).then((user) => {
      if(!user) {
        return done(null, undefined);
      };
      
      let discordUser = user.toObject();
      
      delete discordUser._id;
      delete discordUser.__v;
      
      done(null, discordUser);
    }).catch((error) => {
      done(error, undefined);
    });
  } catch(error) {
    done(error, undefined);
  }
});

export default JWTStrategy;