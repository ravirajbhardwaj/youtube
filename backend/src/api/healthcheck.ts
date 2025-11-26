import { Router, Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Health check passed", null));
})

export default router;