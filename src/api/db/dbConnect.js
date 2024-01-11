const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
    mongoose.connect(process.env.DATABASE_URL, 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(`error: ${error}`));
}

module.exports = dbConnect;