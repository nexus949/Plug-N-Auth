import { config } from "../../../config/config.js"
import jwt from "jsonwebtoken";
import userModel from "../models/schema.js";

export async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) throw new Error("No valid Bearer Token in auth header !");
        const token = req.headers.authorization.split(" ")[1];

        req.user = null;

        if (token) {
            try {
                // console.log(Buffer.byteLength(token, "utf8"));
                const decoded = jwt.verify(token, config.JWT_KEY);

                const user = await userModel.findById(decoded.sub);
                if (!user) return res.status(404).json({ message: "No valid user found !" });

                //verify token version
                if (user.accessVersion !== decoded.accessVersion)
                    return res.status(401).json({
                        message: "You are not authorized !",
                        err: "Token version out of date"
                    });

                req.user = decoded;
                next();
            }
            catch (error) {
                console.log(error);
                return res.status(401).json({ message: "You are not authorized !" });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Error Authorizing !",
            err: error.message
        });
    }
}

export function generateToken(payload, expiry) {
    return jwt.sign(payload, config.JWT_KEY, { expiresIn: `${expiry}` });
}
