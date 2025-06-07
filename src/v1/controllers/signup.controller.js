import userModel from "../models/schema.js";
import { generateToken } from "../middlewares/auth.js"
import { testMail } from "../utils/testMail.js";
import { testPass } from "../utils/testPass.js";
import { hashPassword } from "../utils/hash.js";

export async function signup(req, res) {
    try {
        const userData = req.body;

        //email regex Test
        if(!testMail(userData.userEmail)) return res.status(400).json({ message: "Email Must be valid !" });

        //check if user already exists
        if (await userModel.findOne({ userEmail: userData.userEmail })) return res.status(409).json({ message: "User Already Exists!" });

        //password validation check
        if (!testPass(userData.password)) return res.status(400).json({ message: "Password must follow all the rules !" });

        //create new user
        let newUser = new userModel(userData);
        newUser.password = await hashPassword(newUser.password);

        await newUser.save();

        //JWT creation
        const payload = {
            sub: newUser.id.toString(),
            service: newUser.serviceName,
            iat: Date.now(),
        };
        const token = generateToken(payload, "7d");

        res.status(200).json({
            message: "User created Successfully ✅ !",
            token: token
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}