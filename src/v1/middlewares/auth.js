import { config } from "../../../config/config.js"
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next){

    const token = req.headers.authorization.split(" ")[1];

    req.user = null;

    if(token){
        try{
            const decoded = jwt.verify(token, config.JWT_KEY);
            req.user = decoded;
        }
        catch(error){
            console.log(error);
        }
    }

    next();
}

export function generateToken(payload, expiry){
    return jwt.sign(payload, config.JWT_KEY, { expiresIn: `${expiry}` });
}