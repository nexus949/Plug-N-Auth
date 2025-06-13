import userModel from "../models/schema.js";
import { generateToken } from "../middlewares/auth.js";
import { testMail } from "../utils/testMail.js";
import { testPass } from "../utils/testPass.js";
import { hashPassword } from "../utils/hash.js";

export async function signup(req, res) {
    try {
        const signupData = req.body;

        if (!signupData.userEmail || !signupData.password)
            return res.status(400).json({ message: "Email and password must be provided !" });

        //email regex Test
        if (!testMail(signupData.userEmail)) return res.status(400).json({ message: "Email Must be valid !" });

        //check if user already exists
        if (await userModel.findOne({
            $or: [
                { userEmail: signupData.userEmail, serviceName: signupData.serviceName },
                { userEmail: signupData.userEmail }
            ]
        })) return res.status(409).json({ message: "Email already registered for this service !" });

        //password validation check
        if (!testPass(signupData.password)) return res.status(400).json({ message: "Password must follow all the rules !" });

        //sanitize input data
        const immutableFields = new Set(["id", "_id", "createdOn", "accessVersion"]);
        for (const key in signupData) {
            if (immutableFields.has(key)) {
                delete signupData[key];
            }
        }

        //create new user
        let newUser = new userModel(signupData);
        newUser.password = await hashPassword(newUser.password);

        await newUser.save();

        //JWT creation
        const payload = {
            sub: newUser.id.toString(),
            service: newUser.serviceName,
            accessVersion: newUser.accessVersion
        };
        const token = generateToken(payload, "30m");

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
