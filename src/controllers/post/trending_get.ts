import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { User } from "../../Types/User";
import UserModel from "../../model/User";
import jwt from "jsonwebtoken";
import { Post } from "../../Types/Post";
import PostModel from "../../model/Post";

const trending_get = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    //token
    let username: string = "";
    try {
      const token: string = req.cookies.jwt;
      if (token) {
        const tokenExp: { _id: string } = jwt.verify(token, process.env.KEY) as { _id: string };
        let data: User = await UserModel.findOne({ _id: tokenExp._id, tokens: token }).select("-password");
        if (!data) res.clearCookie("jwt");
        else username = data.username;
      }
    } catch (e) {
      return res.clearCookie("jwt");
    }

    //get posts
    const postsData: Array<Post> = await PostModel.find({
      createdAt: {
        $gte: new Date(Date.now() - 2592000000),
      },
    })
      .limit(100)
      .sort("-likes");

    res.status(200).json({
      code: 200,
      data: {
        posts: postsData,
        username,
      },
    });
  }
);

export default trending_get;
