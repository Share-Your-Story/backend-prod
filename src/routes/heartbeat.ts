import { Router, Request, Response, NextFunction } from "express";
const router = Router();
router.route("/").get((_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({ message: "Heatbeated!" });
});
export default router;
