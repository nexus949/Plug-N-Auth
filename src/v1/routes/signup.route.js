import express from "express";
// import auth from "../middlewares/auth.js";

const router = express.Router();

import {

    signup

} from "../controllers/signup.controller.js";

router.post("/v1/signup", signup);

export default router;