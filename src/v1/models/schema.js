import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userEmail:{
        type: String,
        required: [true, "Email is required !"],
        unique: true,
        trim: true,
        lowercase: true
    },

    password:{
        type: String,
        required: [true, "Password is required !"]
    },

    // Unique identifier for the service, product, or company the user belongs to.
    // Enables multi-tenant data separation and efficient querying.
    serviceName: {
        type: String,
        required: [true, "Service Name is required !"],
        trim: true,
        default: "auth-lime"
    },

    //breadcrums 🍞 ! Might implement as a later feature !
    // username:{
    //     type: String,
    //     required: false,
    //     unique: true,
    //     trim: true
    // },

    //breadcrums 🍞 ! Might implement as a later feature !
    // phone:{
    //     type: Number,
    //     required: false
    // },

    firstName:{
        type: String,
        required: false,
        trim: true
    },

    lastName:{
        type: String,
        required: false,
        trim: true
    },

    role:{
        type: String,
        required: false,
        enum: ["admin", "user", "guest"],
        default: "user"
    },

    createdOn:{
        type: Date,
        required: false,
        default: Date.now,
        immutable: true
    },

    //breadcrums 🍞 ! Might implement as a later feature !
    // updatedOn:{
    //     type: Date,
    //     required: false,
    // },

    //for custom data
    meta: {
        type: Object,
        required: false,
        default: {}
    }
});

//create an index that ensures the combination of serviceName and userEmail is unique -> One email per service !
userSchema.index({ serviceName: 1, userEmail: 1 }, { unique: true });

const userModel = mongoose.model("auth_user", userSchema);

export default userModel;