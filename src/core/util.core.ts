import RocklenAPIServer from "./server.core";
import JWT from "jsonwebtoken";

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
      expiresIn: "1w"
    });
  }
};

export default RocklenAPIServerUtil