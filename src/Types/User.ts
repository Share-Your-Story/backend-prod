import { Document } from "mongoose";
import { Post } from "./Post";

export interface User extends Document {
  username: string;
  displayName: string;
  password: string;
  posts: Array<Post>;
  tokens: Array<string>;
  generateToken(): Promise<string>;
}
