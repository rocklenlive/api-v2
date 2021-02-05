import RocklenAPIServer from "./server.core";
import JWT from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import passport from "passport";

class RocklenAPIServerUtil {
  public server: RocklenAPIServer
  public constructor(server: RocklenAPIServer) {
    this.server = server;
  };
  
  public static createToken(id: string): string {
    return JWT.sign({
      iss: "rocklen-api-util",
      sub: id,
      iat: Date.now()
    }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "3d"
    });
  }
  
  public static authJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", {
      session: false
    }, (err, user) => {
      if(err) return next(err);
      if(!user) {
        return res.status(401).send({
          message: "FAILED_TO_AUTHORIZE",
          code: 401
        });
      }
    })(req, res, next);
    
    return !res.writableEnded;
  }
};

export default RocklenAPIServerUtil