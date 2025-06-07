import { config } from "../config/config.js";
import db from "./DB.js";

import express from "express";
const app = express();

app.listen(config.port, function(){
    console.log(`Server running on Port: ${config.port} 🚀 !`);
})

/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res){
    try{
        res.status(200).json({ message: "Welcome to Auth Lime 🍋 !" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !"});
    }
})

/**
 * Import Routes and use them
 */

import signup from "./v1/routes/signup.route.js";

app.use('/user', signup);