var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");


const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// const databaseConnect = require("./db/db-connect");

var app = express();

app.use(cors());


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HuskyHuddle API",
            version: "1.0.0",
            description: "A Chat Application API"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ],
        
    },
    apis: ["./routes/*.js"]
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// connect to database
// let dbConnection = databaseConnect();

// console.log(dbConnection.config.database);

// const sqlQuery = "SELECT * FROM categories;"
// databaseConnect.query(sqlQuery, (err, result) => {
//   if (err) {
//       console.log("Error");
//   }
//   console.log("result");
//   console.log(result);
//   console.log("result2");
//   result1 = result;
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/info"));
app.use("/channel", require("./routes/channel"));
app.use("/dm", require("./routes/direct-message"));
app.use("/guild", require("./routes/guild"));
app.use("/message", require("./routes/message"));
app.use("/role", require("./routes/role"));
app.use("/user", require("./routes/user"));
app.use("/admin", require("./routes/admin"));
app.use("/random", require("./routes/random"));
app.use("/joke", require("./routes/joke"));
app.use("/stats", require("./routes/stats"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
