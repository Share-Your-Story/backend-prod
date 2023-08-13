import { Schema, model } from "mongoose";
import { Post } from "src/Types/Post";

const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likesData: [{ type: String }],
    author: {
      username: { type: String, required: true },
      displayName: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = model<Post>("Post", postSchema);

export default PostModel;
