require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());

const homeRoute = require('./routes/Home');

app.use("/", homeRoute);

app.listen(process.env['PORT'], function () {
    console.log("Server Started On Port : " + process.env['PORT']);
});
