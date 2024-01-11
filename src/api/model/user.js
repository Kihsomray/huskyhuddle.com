const mongoose = require("mongoose");

const dbUserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            required: [true, "cannot be blank!"],
            match: [/^[a-zA-Z0-9]+$/, "contains invalid characters!"],
            minLength: [3, "is less than 3 characters!"],
            maxLength: [16, "is more than 16 characters!"],
            unique: true,
            index: true
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "cannot be blank!"],
            match: [/\S+@\S+\.\S+/, "isn't a valid email!"],
            unique: true
        },
        hash: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        bio: {
            type: String
        }
    },
    {
        collection: "users",
        timestamps: true,
    }
);

module.exports = mongoose.model.Users || mongoose.model("User", dbUserSchema);