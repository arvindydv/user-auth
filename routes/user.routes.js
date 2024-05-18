import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/profile").get(verifyJwt, getUserProfile);

export default router;
