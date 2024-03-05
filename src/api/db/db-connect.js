require('dotenv').config()

let db = process.env.DATABASE_URL;
const mysql = require('mysql');

const connection = mysql.createConnection(db);

console.log("Connected to " + connection.config.database);

module.exports = connection;
