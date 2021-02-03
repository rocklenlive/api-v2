import { Schema, model, Model } from "mongoose";
import { IUser } from "../types";

const userSchema: Schema = new Schema({
  id: {
    required: true,
    unique: true,
    type: String
  },
  username: {
    required: true,
    type: String
  },
  discriminator: {
    required: true,
    type: String
  },
  avatar: String,
  email: String,
  daily: {
    type: Date,
    default: new Date("1980-1-1")
  },
  paypal: String,
  stream: {
    time: Number,
    last: {
      channel: String,
      date: Date
    }
  }
});

let userModel: Model<IUser> = model<IUser>("user", userSchema, "BOT_USERS");

export default userModel