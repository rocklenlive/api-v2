import express, { Application } from "express";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import passport from "passport";
import * as Influx from "influx";

import Stratigies from "../stratigies";
import Router from "../routes";

class RocklenAPIServer {
  public app: Application;
  public passport: typeof passport;
  public influx: Influx.InfluxDB | null;
  public constructor() {
    this.app = express();
    this.passport = passport;
    this.influx = null;
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
    this.app.use((req, res, next) => {
      if(!this.influx) return next();
      
      const start = Date.now();
      
      res.on("finish", () => {
        
        const duration = Date.now() - start;
        
        this.influx?.writePoints([
          {
            measurement: "api_requests",
            fields: {
              duration,
              path: req.path,
              id: (req.user as any)?.id,
              token: req.headers?.authorization
            },
            tags: {
              ip: req.ip,
              method: req.method.toLowerCase()
            }
          }
        ])
      });
      
      return next();
    });
    
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
          console.log("Connected to mongo!");
          try {
            // this.influx = new Influx.InfluxDB({
            //   host: process.env.INFLUX_DB_HOST,
            //   database: process.env.INFLUX_DB_NAME,
            //   schema: [
            //     {
            //       measurement: "api_requests",
            //       fields: {
            //         path: Influx.FieldType.STRING,
            //         duration: Influx.FieldType.INTEGER,
            //         id: Influx.FieldType.STRING,
            //         token: Influx.FieldType.STRING
            //       },
            //       tags: [
            //         "ip",
            //         "method"
            //       ]
            //     }
            //   ]
            // });
            // // Connecting to influx!
            // new Promise<Influx.InfluxDB>(async (influxRes, influxRej) => {
            //   try {
            //     let influx = new Influx.InfluxDB({
            //       host: process.env.INFLUX_DB_HOST,
            //       database: process.env.INFLUX_DB_NAME,
            //       schema: [
            //         {
            //           measurement: "api_requests",
            //           fields: {
            //             path: Influx.FieldType.STRING,
            //             duration: Influx.FieldType.INTEGER,
            //             id: Influx.FieldType.STRING,
            //             token: Influx.FieldType.STRING
            //           },
            //           tags: [
            //             "ip",
            //             "method"
            //           ]
            //         }
            //       ]
            //     });
            //     influx.getDatabaseNames().then((dbs) => {
            //       let db = process.env.INFLUX_DB_NAME as string;
            //       if(!dbs.includes(db)) {
            //         console.log("Database wasn't found! Creating one..");
            //         influx.createDatabase(process.env.INFLUX_DB_NAME as string).then(() => {
            //           console.log("Created database");
                      
            //           influxRes(influx);
            //         }).catch(influxRej)
            //         influxRes(influx);
            //       } else {
            //         influxRes(influx);
            //       }
            //     }).catch(influxRej);
            //   } catch(e) {
            //     influxRej(e);
            //   }
            // }).then((influx) => {
            //   this.influx = influx;
            //   console.log("Connected to influx!");
            //   resolve(this);
            // }).catch((error) => {
            //   return reject(error);
            // });
            resolve(this);
          } catch (error) {
            return reject(error);
          }
        }).catch(reject);
      } catch(error) {
        reject(error);
      }
    });
  };
  
  public build(): RocklenAPIServer {
    console.log("Building!");
    
    this.app.use(this.passport.initialize());
    console.log("Initialized passport!");
    
    this.useStratigies();
    console.log("Used strats");
    
    this.buildRoutes();
    console.log("built routes");
    
    return this;
  }
  
  public launch(): RocklenAPIServer {
    this.app.listen(process.env.PORT, () => {
      console.log("Launched");
    });
    return this;
  }
};

export default RocklenAPIServer;