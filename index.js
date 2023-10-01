require('dotenv').config();
const cors = require("cors")
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(cors({ origin: process.env['ORIGIN'] }));
app.use(express.json());

const homeRoute = require('./routes/Home');

app.use("/", homeRoute);

mongoose.connect(process.env['mongoDBURL'], {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database Connected");
    app.listen(process.env['PORT'], function () {
        console.log("Server Started On Port : " + process.env['PORT']);
    });
})
.catch((err) => console.log(err));


