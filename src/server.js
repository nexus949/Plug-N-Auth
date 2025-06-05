import { config } from "../config/config.js"

import express from "express";
const app = express();

app.listen(config.port, function(){
    console.log(`Server running on Port: ${config.port} 🚀 !`);
})

app.get("/", function(req, res){
    try{
        res.status(200).json({ message: "Welcome to Auth Lime 🍋 !" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Some Error Occured !" });
    }
})