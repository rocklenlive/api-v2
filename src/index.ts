import dotenv from "dotenv";
dotenv.config();

import Server from "./core/server.core";
import { RocklenAPIServerConfig } from "./types";
import YAML from "yaml";
import fs from "fs";
import path from "path";

let data: string = fs.readFileSync(path.join(__dirname, "..", "config.yaml"), "utf-8");
let config: RocklenAPIServerConfig = YAML.parse(data);


let server = new Server(config);

server.connect().then(() => {
  server.build().launch();
}).catch(error => {
  throw error;
})