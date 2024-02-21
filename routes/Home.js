require('dotenv').config();
const express = require("express");
const router = express.Router();
const axios = require('axios');
var generator = require('generate-password');
var request = require("request");
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env['PINATA_JWT'] });

async function saveData(data) {
  const res = await pinata.pinJSONToIPFS(data)
  //console.log(res)
  return res
}


router.post('/voterIdApplication', async (req, res) => {

  //console.log(req.body);

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;


  let cage = Math.abs((new Date(currentDate) - new Date(req.body.dob)) / (1000 * 60 * 365 * 60 * 24));
  cage = 50
  if (cage > 17) {

    let voter_data = {
      name: req.body.name,
      gender: req.body.gender,
      dob: req.body.dob,
      age: Math.floor(cage),
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      pincode: req.body.pincode
    }


    let res = await saveData(voter_data)
    console.log('Voter data added successfully to IPFS')
    console.log('CID ' + res.IpfsHash)



    var password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
    });

    //console.log("Rand Pass generated for user is : " + password);

    let data = JSON.stringify({
      "email": req.body.email,
      "blocked": false,
      "given_name": "NA",
      "family_name": "NA",
      "name": req.body.name,
      "user_id": req.body.email,
      "connection": "Username-Password-Authentication",
      "password": password,
      "verify_email": false,
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
          console.log("User Registered Successfully");
          //res.status(200).send("User Registered Successfully");
        })
        .catch((error) => {
          console.log(error);
          //res.status(451).send("User Registration Failed!");
        });

    });

  }

  res.status(200).send("User Registered Successfully");



});

module.exports = router;