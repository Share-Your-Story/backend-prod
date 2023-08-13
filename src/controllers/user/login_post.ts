import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/User";
import bcrypt from "bcrypt";
import { User } from "../../Types/User";
import { cookiesOption } from "../../utils/cookiesOption";

const login_post = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const { username, password } = req.body;

    //check if all fields provided
    if (!username || !password) return res.status(400).json({ code: 400, message: "All fields must be provided." });

    //types
    if (typeof username !== "string" || typeof password !== "string") return res.status(400).json({ code: 400, message: "Invalid data." });

    //check if password exists
    let user: User = await UserModel.findOne({ username });
    if (!user) return res.status(400).json({ code: 400, message: "User not found." });

    //compare password
    const passwordMatch: boolean = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ code: 400, message: "Invalid password." });

    //token
    const token: string = await user.generateToken();
    res.cookie("jwt", token, cookiesOption);

    //return
    return res.status(200).json({ code: 200, message: "Login successful" });
  }
);

export default login_post;
