import userModel from "../models/schema.js";
import { verifyPassword } from "../utils/hash.js";

export async function _delete(req, res){
    try{
        const { password } = req.body;
        const user_id = req.user.sub; //get user id from req.user header
        const serviceName = req.user.service;

        if(!password) return res.status(400).json({ message: "Password is required !" });

        //find user
        const user = await userModel.findOne({ _id: user_id, serviceName: serviceName });
        if(!user) return res.status(404).json({ message: "No valid user found !" });

        //verify password
        if(!await verifyPassword(user.password, password))
            return res.status(401).json({ message: "Password is incorrect !" });

        //successfully delete the user
        await userModel.findOneAndDelete({ _id: user_id, serviceName: serviceName });

        res.status(200).json({
            message: "User deleted Successfully ✅ !",
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}
