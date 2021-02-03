import express, { Application } from "express";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import passport from "passport";

import { RocklenAPIServerConfig } from "../types";

import Stratigies from "../stratigies";
import Router from "../routes";

class RocklenAPIServer {
  public app: Application;
  public passport: typeof passport;
  public config: RocklenAPIServerConfig;
  public constructor(config: RocklenAPIServerConfig) {
    this.config = config;
    this.app = express();
    this.passport = passport;
  };
  
  protected createToken(id: string): string {
    return JWT.sign({
      iss: "rocklen-api",
      sub: id,
      iat: Date.now()
    }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "1w"
    });
  }
  
  protected useStratigies(): void {
    const stratigies = Object.values(Stratigies);
    for(const strategy of stratigies) {
      this.passport.use(strategy);
    }
  }
  
  protected buildRoutes(): void {
    this.app.use(Router);
  }
  
  public connect(): Promise<RocklenAPIServer> {
    return new Promise(async (resolve, reject) => {
      try {
        mongoose.connect("mongodb://localhost:27017/testing-bot", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        }).then(() => {
          console.log("Connected to db!");
          resolve(this);
        }).catch(reject);
      } catch(error) {
        reject(error);
      }
    });
  };
  
  public build(): RocklenAPIServer {
    this.app.use(this.passport.initialize());
    this.useStratigies();
    this.buildRoutes();
    return this;
  }
  
  public launch(): RocklenAPIServer {
    this.app.listen(this.config.port, () => {
      console.log("Launched");
    });
    return this;
  }
};

export default RocklenAPIServer;