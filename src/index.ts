//env variables
require("dotenv").config({ path: __dirname + "/.env" });
const PORT: number = Number(process.env.PORT) || 8080;
const DB_KEY: string = process.env.DB_KEY;

//imports
import express, { Application, Request, Response } from "express";
const app: Application = express();
import mongoose from "mongoose";
import { connectDB } from "./utils/database/connectDb";
import requestHandler from "./middleware/requestHandler";
import errorHandler from "./middleware/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import heartbeatRouter from "./routes/heartbeat";

//express stuffs
app.use(requestHandler);
app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/heartbeat", heartbeatRouter);
app.all("*", (_req: Request, res: Response) => {
  res.status(404).json({ message: "404 not found" });
});
app.use(errorHandler);

//database connection and listen to port
connectDB(DB_KEY);

mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (e) => {
  console.log(e);
});
