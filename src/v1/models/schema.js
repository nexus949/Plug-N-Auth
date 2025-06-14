import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        required: [true, "Email is required !"],
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, "Password is required !"]
    },

    // Unique identifier for the service, product, or company the user belongs to.
    // Enables multi-tenant data separation and efficient querying.
    serviceName: {
        type: String,
        required: [true, "Service Name is required !"],
        trim: true,
        default: "plug-n-auth"
    },

    //breadcrums 🍞 ! Might implement as a later feature !
    // username:{
    //     type: String,
    //     required: false,
    //     unique: true,
    //     trim: true,
    //     default: null
    // },

    //breadcrums 🍞 ! Might implement as a later feature !
    // phone:{
    //     type: Number,
    //     required: false,
    //     default: null
    // },

    firstName: {
        type: String,
        required: false,
        trim: true,
        default: null
    },

    lastName: {
        type: String,
        required: false,
        trim: true,
        default: null
    },

    role: {
        type: String,
        required: false,
        enum: ["admin", "user", "guest"],
        default: "user"
    },

    createdOn: {
        type: Date,
        required: false,
        default: Date.now,
        immutable: true
    },

    accessVersion:{
        type: Number,
        required: true,
        default: 1
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
userSchema.index({ userEmail: 1, serviceName: 1 }, { unique: true });

//index for more efficieny on the id + serviceName queries
userSchema.index({ _id: 1, serviceName: 1 }, { unique: true });

const userModel = mongoose.model("auth_user", userSchema);

export default userModel;
