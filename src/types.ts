import { Document } from "mongoose";

export interface JWTPayload {
  iss: string
  sub: string
  iat: number
  exp: number
}

export interface RocklenAPIServerConfig {
  port: number
  auth: {
    discord: {
      id: string
      callbackURL: string
      endpoint: string
    }
  }
}


export interface IUser extends Document {
  id: string
  username: string
  discriminator: string
  avatar: string
  email: string | null
  daily: string
  paypal: string
  stream: {
    time: number
    last: {
      channel: string
      date: Date
    }
  }
}