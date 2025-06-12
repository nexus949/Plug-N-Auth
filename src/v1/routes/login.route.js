import express from "express";

const router = express.Router();

import {

    login

} from "../controllers/login.controller.js";

router.post("/v1/login", login);

export default router;
