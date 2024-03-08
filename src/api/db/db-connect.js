// require('dotenv').config();

// let db = process.env.DATABASE_URL;
const mysql = require('mysql');


const mysqlConfig = {
    host: "aws.connect.psdb.cloud", 
    port: 3306,
    user: "gogvaiwd7d188g976xvq", 
    password: "pscale_pw_FeuTEtneIlJIfQH8r0hj5JM2jejUmtkG3GWDVPgZ3UJ", // REMOVE THIS IF YOU PUSH AT ANYTIME
    database: "husky-huddle",
    ssl: true,
    debug: false // Connection debugging mode is ON
};


const connection = mysql.createConnection(mysqlConfig);

// const connection = mysql.createConnection(db);

console.log("Connected to " + connection.config.database);

module.exports = connection;
