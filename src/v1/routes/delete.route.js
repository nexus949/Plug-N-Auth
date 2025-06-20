import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

import {

    _delete

} from "../controllers/delete.controller.js";

router.delete("/v1/deleteUser", verifyToken, _delete);

export default router;
