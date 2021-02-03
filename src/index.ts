import dotenv from "dotenv";
dotenv.config();

import Server from "./core/server.core";

let server = new Server();

server.connect().then(() => {
  server.build().launch();
}).catch(error => {
  throw error;
})