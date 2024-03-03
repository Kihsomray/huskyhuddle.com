// const mongoose = require("mongoose");
// require("dotenv").config();

// async function dbConnect() {
//     mongoose.connect(process.env.DATABASE_URL, 
//     {
//         useUnifiedTopology: true,
//         useNewUrlParser: true
//     })
//     .then(() => console.log("MongoDB connected"))
//     .catch((error) => console.log(`error: ${error}`));
// }

// module.exports = dbConnect;



require('dotenv').config()

let db = process.env.DATABASE_URL;

console.log("this is " + db);



const express = require('express');
const mysql = require('mysql');


// const mysqlConfig = {
//     host: "aws.connect.psdb.cloud", 
//     port: 3306,
//     user: "gogvaiwd7d188g976xvq", 
//     password: "",
//     database: "husky-huddle",
//     debug: false // Connection debugging mode is ON
// };


// const dbConnection = mysql.createConnection(mysqlConfig);

// console.log('Backend is now connected to: ' + dbConnection.config.database + '.');

// dbConnection.query(sqlQuery), (err, result) => {
//     if (err) {
//         // console.log("Error");
//     } 
//     // console.log("result");
//     // console.log("Something here" + result);
//     // console.log("result2");
// };

const connection = mysql.createConnection(db);

// const app = express();

var result;
var result1 = "test";

//connection = mysql.createConnection(DATABASE_URL);

async function dbConnect() {
    console.log("mysql is connected to " + connection.config.database);

    return connection;
}

module.exports = connection;
