require('dotenv').config();
const cors = require("cors")
const { auth } = require('express-openid-connect');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: process.env['ORIGIN'] }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const homeRoute = require('./routes/Home');
const userRoute = require('./routes/User');

app.use("/", homeRoute);
app.use("/user", homeRoute);

const prop = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:3001',
    clientID: 'oLS4A8L6C01LmST3hOke9rEvOWCmJfc2',
    issuerBaseURL: 'https://dev-ug5wbcmf8y8ide7v.us.auth0.com',
    secret: 'LONG_RANDOM_STRING'
  };

  app.use(auth(prop));

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

/*app.listen(process.env['PORT'], function () {
    console.log("Server Started On Port : " + process.env['PORT']);
});*/

