import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/User";
import bcrypt from "bcrypt";
import usernameValidator from "../../utils/validators/usernameValidator";
import passwordValidator from "../../utils/validators/passwordValidator";
import { User } from "../../Types/User";
import { cookiesOption } from "../../utils/cookiesOption";

const post = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const { displayName, username, password } = req.body;
    //check if all fields provided
    if (!displayName || !username || !password || displayName.trim().length === 0) return res.status(400).json({ code: 400, message: "All fields must be provided." });

    //types
    if (typeof displayName !== "string" || typeof username !== "string" || typeof password !== "string") return res.status(400).json({ code: 400, message: "Invalid data." });

    //validate
    let validateUsername: { valid: boolean; message?: string } = usernameValidator(username);
    if (!validateUsername.valid) return res.status(400).json({ code: 400, message: validateUsername.message });
    let validatePassword: { valid: boolean; message?: string } = passwordValidator(password);
    if (!validatePassword.valid) return res.status(400).json({ code: 400, message: validatePassword.message });

    //duplicate
    const duplicate: User = await UserModel.findOne({ username }).lean();
    if (duplicate) return res.status(409).json({ code: 409, message: `User named ${username} already exists.` });

    //hashing password
    const hashedPass: string = await bcrypt.hash(password, 10);

    //save to database and jwt token
    const user: User = await UserModel.create({ username, displayName, password: hashedPass });
    const token: string = await user.generateToken();
    res.cookie("jwt", token, cookiesOption);

    //response
    if (user) res.status(200).json({ code: 200, message: `Successful` });
    else res.status(400).json({ code: 400, message: "Invalid data." });
  }
);

export default post;
