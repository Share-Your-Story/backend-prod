import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { User } from "../../Types/User";
import UserModel from "../../model/User";
import jwt from "jsonwebtoken";

const account_get = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    //token
    let data: User;
    try {
      const token: string = req.cookies.jwt;
      if (!token) return res.status(401).json({ code: 401, message: "Unauthorized" });
      const tokenExp: { _id: string } = jwt.verify(token, process.env.KEY) as { _id: string };
      data = await UserModel.findOne({ _id: tokenExp._id, tokens: token }).select("-password");
      if (!data) return res.clearCookie("jwt").status(401).json({ code: 401, message: "Unauthorized" });
    } catch (e) {
      return res.clearCookie("jwt").status(401).json({ code: 401, message: "Unauthorized" });
    }

    res.status(200).json({ code: 200, data });
  }
);

export default account_get;
