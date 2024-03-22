require('dotenv').config();
const cors = require("cors")
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: process.env['ORIGIN'] })); //{ origin: process.env['ORIGIN'] }
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const registrationRoute = require('./routes/Register');
const voterDataRoute = require('./routes/User');

app.use("/register", registrationRoute);
app.use("/user", voterDataRoute);


app.listen(process.env['PORT'], function () {
    console.log("*    *    *\nServer Started On Port : " + process.env['PORT']+"\n*    *    *");
});
