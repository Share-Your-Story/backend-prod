import { Document } from "mongoose";

export interface Post extends Document {
  title: string;
  body: string;
  likes?: number;
  likesData?: Array<string>;
  author: Author;
}

export interface Author {
  username: string;
  displayName: string;
}
