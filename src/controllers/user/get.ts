import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

const get = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {});

export default get;
