import { Router, Request, Response, NextFunction } from "express";
import like_post from "../controllers/post/like_post";
import post from "../controllers/post/post";
import trending_get from "../controllers/post/trending_get";
import home_get from "../controllers/post/home_get";
const router = Router();

router.route("/").post((req: Request, res: Response, next: NextFunction) => {
  post(req, res, next);
});

router.route("/like").post((req: Request, res: Response, next: NextFunction) => {
  like_post(req, res, next);
});

router.route("/trending").get((req: Request, res: Response, next: NextFunction) => {
  trending_get(req, res, next);
});

router.route("/home").get((req: Request, res: Response, next: NextFunction) => {
  home_get(req, res, next);
});
export default router;
