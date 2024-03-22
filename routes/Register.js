require('dotenv').config();
const express = require("express");
const router = express.Router();
const axios = require('axios');
var generator = require('generate-password');
var request = require("request");
const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env['PINATA_JWT'] });

const method = process.env['ENCRYPTION_METHOD'];
const key = Buffer.from(process.env['SECRET_KEY'], 'hex');
const iv = Buffer.from(process.env['SECRET_IV'], 'hex');

async function encrypt(text) {
  const cipher = createCipheriv(method, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

async function decrypt(encryptedData) {
  const decipher = createDecipheriv(method, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


async function saveData(data) {
  console.log('Saving voter data to IPFS ...')
  const res = await pinata.pinJSONToIPFS(data)
  console.log('Voter data saved successfully to IPFS')
  console.log('CID ' + res.IpfsHash)
  return res
}

router.post('/voterRegistration', async (req, res) => {

  //console.log(req.body);

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;


  let cage = Math.abs((new Date(currentDate) - new Date(req.body.dob)) / (1000 * 60 * 365 * 60 * 24));
  var vage = Math.floor(cage);
  if (cage > 17) {

    console.log("Received Voter Data : " + JSON.stringify(req.body));
    console.log("Data Encryption In Progress ...")

    let voter_data = {
      name: await encrypt(req.body.name),
      gender: await encrypt(req.body.gender),
      dob: await encrypt(req.body.dob),
      age: await encrypt(vage.toString()),
      phone: await encrypt(req.body.phone.toString()),
      email: await encrypt(req.body.email),
      address: await encrypt(req.body.address),
      pincode: await encrypt(req.body.pincode.toString())
    }

    console.log("Data Encrypted Successfully")
    console.log(voter_data)

    let res = await saveData(voter_data)

    // var password = generator.generate({
    //   length: 10,
    //   numbers: true,
    //   symbols: true,
    //   uppercase: true,
    //   lowercase: true,
    // });

    //console.log("Rand Pass generated for user is : " + password);

    let data = JSON.stringify({
      "email": req.body.email,
      "blocked": false,
      "given_name": "NA",
      "family_name": "NA",
      "name": req.body.name,
      "user_id": req.body.email,
      "connection": "Username-Password-Authentication",
      "password": req.body.password,
      "verify_email": true,
      //"phone_number": "string",
      //"user_metadata": {},
      "blocked": false,
      "email_verified": false,
      //"phone_verified": false,
      //"app_metadata": {},
      "nickname": res.IpfsHash,
      //"picture": "NA",
      "username": res.IpfsHash
    });


    var options = {
      method: 'POST',
      url: 'https://dev-ug5wbcmf8y8ide7v.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: process.env['AUTH0_TOKEN']
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const obj = JSON.parse(body);
      const access_token = obj.access_token;
      const token_type = obj.token_type;
      let authorize = token_type + ' ' + access_token;

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://dev-ug5wbcmf8y8ide7v.us.auth0.com/api/v2/users',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': authorize
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log("Voter Registered Successfully");
          console.log("*    *    *");
          //res.status(200).send("User Registered Successfully");
        })
        .catch((error) => {
          console.log(error);
          //res.status(451).send("User Registration Failed!");
        });

    });

  }

  res.status(200).send("Voter Registered Successfully");



});

module.exports = router;
