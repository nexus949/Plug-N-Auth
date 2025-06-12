import express from "express";

const router = express.Router();

import {

    signup

} from "../controllers/signup.controller.js";

router.post("/v1/signup", signup);

export default router;
