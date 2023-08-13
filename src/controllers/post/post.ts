import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/User";
import PostModel from "../../model/Post";
import jwt from "jsonwebtoken";
import { User } from "../../Types/User";
import { Post } from "../../Types/Post";

const post = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const { title, body } = req.body;

    //check if all fields provided
    if (!title || !body || title.trim().length === 0 || body.trim().length === 0) return res.status(400).json({ code: 400, message: "All fields must be provided." });

    //check types and validate title
    if (typeof title !== "string" || typeof body !== "string") return res.status(400).json({ code: 400, message: "Invalid data." });
    if (title.length > 50) return res.status(400).json({ code: 400, message: "Title too long. Please keep it short and simple." });

    //token
    let authorData: User;
    try {
      const token: string = req.cookies.jwt;
      if (!token) return res.status(401).json({ code: 401, message: "Unauthorized" });
      const tokenExp: { _id: string } = jwt.verify(token, process.env.KEY) as { _id: string };
      authorData = await UserModel.findOne({ _id: tokenExp._id, tokens: token }).select("-password");
      if (!authorData) return res.clearCookie("jwt").status(401).json({ code: 401, message: "Unauthorized" });
    } catch (e) {
      return res.clearCookie("jwt").status(401).json({ code: 401, message: "Unauthorized" });
    }

    //save to db
    let post: Post = await PostModel.create({
      author: {
        username: authorData.username,
        displayName: authorData.displayName,
      },
      title,
      body,
    });
    if (post) {
      authorData.posts.unshift(post);
      await authorData.save();
      res.status(200).json({ code: 200, message: `Post has been created.` });
    } else res.status(400).json({ code: 400, message: "Invalid post data." });
  }
);

export default post;
