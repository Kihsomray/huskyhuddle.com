const mongoose = require("mongoose");

const dbUserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { collection: "Users" }
);

module.exports = mongoose.model.Users || mongoose.model("User", dbUserSchema);