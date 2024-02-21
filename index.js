require('dotenv').config();
const cors = require("cors")
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(cors()); //{ origin: process.env['ORIGIN'] }
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const homeRoute = require('./routes/Home');
const userRoute = require('./routes/User');

app.use("/", homeRoute);
app.use("/user", userRoute);


app.listen(process.env['PORT'], function () {
    console.log("Server Started On Port : " + process.env['PORT']);
});

