import userModel from "../models/schema.js";
import { testMail } from "../utils/testMail.js";
import { testPass } from "../utils/testPass.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";

export async function update(req, res) {
    try {
        const updateData = req.body;
        const user_id = req.user.sub; //get user id from req.user header
        const serviceName = req.user.service; //get service name from req.user header

        if (!updateData) return res.status(400).json({ message: "No Data recieved that can be updated !" });
        if(!updateData.password) return res.status(401).json({ message: "Password is required !" });

        //find user
        let user = await userModel.findOne({ _id: user_id, serviceName: serviceName });
        if (!user) return res.status(404).json({ message: "User not found !" });

        user = user.toObject(); //convert mongoose document into an object -> so that functions like Object.hasOwn works

        //verify user password
        if (!await verifyPassword(user.password, updateData.password))
            return res.status(401).json({ message: "Password is incorrect !" });

        const immutableFields = new Set(["_id", "id", "userEmail", "password", "serviceName", "createdOn", "accessVersion"]);

        //find matching keys from updateData in user and if found update it
        for (const key in updateData) {
            //skip immutable values
            if (immutableFields.has(key.trim())) continue;

            if (Object.hasOwn(user, key.trim())) {
                user[key] = updateData[key];
            }
        }

        //update the user
        await userModel.updateOne(
            { _id: user._id },
            user,
            { runValidators: true, new: true }
        );

        res.status(200).json({
            message: "User updated Successfully ✅ !",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}

export async function updateEmail(req, res) {
    try {
        const { newUserEmail, password } = req.body;
        const user_id = req.user.sub;
        const serviceName = req.user.service;

        if (!newUserEmail || !password)
            return res.status(400).json({ message: "New email and password are required!" });

        //validate Email
        if (!testMail(newUserEmail)) return res.status(400).json({ message: "Email must be valid !" });

        //check if the valid user is present
        let user = await userModel.findOne({ _id: user_id, serviceName: serviceName });
        if (!user) return res.status(404).json({ message: "User not found !" });

        //check for existing user
        const existingUser = await userModel.findOne({
            userEmail: newUserEmail,
            serviceName: serviceName
        });

        if (existingUser) {
            if (existingUser._id.toString() !== user_id) {
                return res.status(400).json({ message: "Email already in use for this service!" });
            }
            return res.status(200).json({ message: "You are already using this email!" });
        }

        //check if password is correct or not
        if (!await verifyPassword(user.password, password))
            return res.status(401).json({ message: "Password is incorrect !" });

        //update the user Email
        await userModel.findByIdAndUpdate(
            user_id,
            { $set: { userEmail: newUserEmail } },
            { runValidators: true, new: true }
        );

        res.status(200).json({
            message: "User updated Successfully ✅ !",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}

export async function updatePass(req, res) {
    try {
        const { oldPassword, newPassword, confNewPassword } = req.body;
        const user_id = req.user.sub;
        const serviceName = req.user.service;

        if (!oldPassword || !newPassword || !confNewPassword)
            return res.status(400).json({ message: "Old and new Passwords must be provided !" });

        //find user
        const user = await userModel.findOne({ _id: user_id, serviceName: serviceName });
        if (!user) return res.status(404).json({ message: "User not found !" });

        //check if old password is correct or not
        if (!await verifyPassword(user.password, oldPassword))
            return res.status(401).json({ message: "Old Password is incorrect !" });

        //check if old password is same as the new password
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New Password cannot be the same as new password !" });
        }

        //check if new password and confirm new password are equal and also if new passwords match password criteria
        if (newPassword !== confNewPassword || !testPass(newPassword))
            return res.status(400).json({ message: "Both the new passwords must match and be valid!" });

        //hash the new password and update user
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Password updated Successfully ✅ !",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}
