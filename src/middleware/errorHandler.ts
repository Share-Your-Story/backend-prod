import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { ErrorRequestHandler, Request, Response } from "express";

const errorHandler: ErrorRequestHandler = async (err: any, req: Request, res: Response) => {
  //the message
  let dateTime: string = await format(new Date(), "dd/MM/yyyy HH:mm:ss");
  let logMessage: string = `${err.name}: ${err.message}\t${req.method}\t${uuid()}\t${dateTime}\t${req.url}\t${req.headers.origin ? req.headers.origin : ""}\n`;

  //create folder
  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) await fs.mkdirSync(path.join(__dirname, "..", "logs"));

  //append
  await fs.appendFileSync(path.join(__dirname, "..", "logs", "errors.log"), logMessage);

  console.log(logMessage);
  console.log(err.stack);
  res.status(res.statusCode ? res.statusCode : 500).json(err.message);
};

export default errorHandler;
