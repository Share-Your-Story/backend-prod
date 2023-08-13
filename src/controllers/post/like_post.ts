import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/User";
import PostModel from "../../model/Post";
import jwt from "jsonwebtoken";
import { User } from "../../Types/User";
import { Post } from "../../Types/Post";

const like_post = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const { _id } = req.body;

    //check if all fields provided
    if (!_id) return res.status(400).json({ code: 400, message: "All fields must be provided." });

    //check types
    if (typeof _id !== "string") return res.status(400).json({ code: 400, message: "Invalid data." });

    //token
    let userData: User;
    try {
      const token: string = req.cookies.jwt;
      if (!token) return res.status(401).json({ code: 401, message: "Unauthorized" });
      const tokenExp: { _id: string } = jwt.verify(token, process.env.KEY) as { _id: string };
      userData = await UserModel.findOne({ _id: tokenExp._id, tokens: token }).select("-password");
      if (!userData) return res.clearCookie("jwt").status(401).json({ code: 401, message: "Unauthorized" });
    } catch (e) {
      return res.clearCookie("jwt").status(401).json({ code: 401, message: "Unauthorized" });
    }

    //check if post exists
    let postData: Post = await PostModel.findById(_id);
    if (!postData) return res.status(400).json({ code: 400, message: "Invalid Post." });

    //check if already liked
    if (postData.likesData.includes(userData.username)) return res.status(400).json({ code: 400, message: "Post already liked." });

    //update post
    postData.likes++;
    postData.likesData.push(userData.username);

    //update user
    for (let i = 0; i < userData.posts.length; i++) {
      if (userData.posts[i]._id.toString() === _id) userData.posts[i] = postData;
    }

    //save to database
    await postData.save();
    await userData.save();
    res.status(200).json({ code: 200, message: "Post Liked." });
  }
);

export default like_post;
