import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

import {

    update,
    updateEmail,
    updatePass

} from "../controllers/update.controller.js";

router.put("/v1/update", verifyToken, update);
router.put("/v1/updateEmail", verifyToken, updateEmail);
router.put("/v1/updatePass", verifyToken, updatePass);

export default router;
