import userModel from "../models/schema.js";
import { verifyPassword } from "../utils/hash.js";
import { generateToken } from "../middlewares/auth.js";

export async function login(req, res) {
    try {
        const { userEmail, password, serviceName } = req.body;

        if (!userEmail || !password || !serviceName)
            return res.status(400).json({ message: "Email, Password and service name is required !" });

        //look for user
        const user = await userModel.findOne({
            userEmail: userEmail,
            serviceName: serviceName
        });
        if (!user) return res.status(404).json({ message: "No valid user found !" });

        //check if password is correct or not
        const isPasswordCorrect = await verifyPassword(user.password, password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Password is incorrect !" });

        //update the accessVersion for JWT
        await userModel.findByIdAndUpdate(
            user._id,
            { $inc: { accessVersion: 1 } },
            { runValidators: true, new: true }
        );

        //JWT creation
        const payload = {
            sub: user.id.toString(),
            service: user.serviceName,
            accessVersion: user.accessVersion + 1  //+1 since the user here is the local one and not the one that got just saved !
        };
        const token = generateToken(payload, "30m");

        res.status(200).json({
            message: "User Logged in Successfully ✅ !",
            token: token
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}
