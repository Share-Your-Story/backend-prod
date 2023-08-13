import { Schema, model } from "mongoose";
import { User } from "src/Types/User";
import jwt from "jsonwebtoken";

const userSchema = new Schema<User>(
  {
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    posts: [],
    tokens: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = async function (): Promise<string> {
  try {
    let token: string = jwt.sign({ _id: this._id }, process.env.KEY);
    this.tokens.push(token);
    await this.save();
    return token;
  } catch (err) {
    console.log("An error occured while generating token.");
  }
};

const UserModel = model<User>("User", userSchema);

export default UserModel;
