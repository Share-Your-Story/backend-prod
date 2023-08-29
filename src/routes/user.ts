import { Router, Request, Response, NextFunction } from "express";
import post from "../controllers/user/post";
import login_post from "../controllers/user/login_post";
import account_get from "../controllers/user/account_get";
const router = Router();

router.route("/").post((req: Request, res: Response, next: NextFunction) => {
  post(req, res, next);
});

router.route("/login").post((req: Request, res: Response, next: NextFunction) => {
  login_post(req, res, next);
});

router.route("/account").get((req: Request, res: Response, next: NextFunction) => {
  account_get(req, res, next);
});
export default router;
