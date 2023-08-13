import { CookieOptions } from "express";

export const cookiesOption: CookieOptions = { httpOnly: true, sameSite: "none", secure: true, expires: new Date(new Date().getTime() + 25892000000) };
