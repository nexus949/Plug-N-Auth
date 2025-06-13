import { config } from "../config/config.js"
import mongoose from "mongoose";

const dbURL = 'mongodb://localhost:27017/plug-n-auth';
mongoose.connect(config.DB_URL || dbURL);

let db = mongoose.connection;

//server event listeners
db.on("connected", () =>{
    console.log("Connected to database");
})

db.on("disconnected", () =>{
    console.log("Disconnected from database");
})

db.on("error", (error) =>{
    console.log("MongoDB connection error" + error);
})

export default db;
