import userModel from "../models/schema.js";

export async function status(req, res) {
    try {
        const user_id = req.user.sub;
        const serviceName = req.user.service

        let user = await userModel.findOne({ _id: user_id, serviceName: serviceName });
        if (!user) return res.status(404).json({ message: "No valid user found !" });

        //convert mongoose document to object
        user = user.toObject();
        const dontSend = new Set(["_id", "password", "accessVersion", "createdOn"]);

        //filter out falsy and empty values
        for(const key in user){
            if(dontSend.has(key) || !user[key]){
                delete user[key];
            }
        }

        res.status(200).json({
            authenticated: true,
            userInfo: {
                email: user.userEmail,
                service: user.serviceName,
                first_name: user.firstName,
                last_name: user.lastName,
                role: user.role
            }
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ErrMsg: "Oops 😳 ! Some Error Occured !" });
    }
}
