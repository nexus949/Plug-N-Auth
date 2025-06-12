import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

import {

    status

} from "../controllers/status.controller.js";

router.get("/v1/status", verifyToken, status);

export default router;
