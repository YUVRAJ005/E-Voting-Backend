require('dotenv').config();
const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');
const express = require("express");
const router = express.Router();

const method = process.env['ENCRYPTION_METHOD'];
const key = Buffer.from(process.env['SECRET_KEY'], 'hex');
const iv = Buffer.from(process.env['SECRET_IV'], 'hex');

async function decrypt(encryptedData) {
  const decipher = createDecipheriv(method, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function getData(cid) {
    try {
       let fetchurl = "https://" + process.env['PINATA_GATEWAY'] + "/ipfs/" + cid ;
      const res = await fetch(
        fetchurl,
      );
      const resData = await res.text();
      //console.log(resData);
      return resData;
    } catch (error) {
      console.log(error);
    }
  }

router.get('/profile/:id', async (req, res) => {
    
    console.log("Request to fetch data for CID : " + req.params.id);
    try{
        var data = await getData(req.params.id);
        console.log("Fetched Encrypted Data from IPFS : " + data);
        data = JSON.parse(data);
        console.log("Decrypting data ...");
        let voter_data = {
          name: await decrypt(data.name),
          gender: await decrypt(data.gender),
          dob: await decrypt(data.dob),
          age: await decrypt(data.age),
          phone: await decrypt(data.phone),
          email: await decrypt(data.email),
          address: await decrypt(data.address),
          pincode: await decrypt(data.pincode)
        }
        voter_data  = JSON.stringify(voter_data);
        console.log("Data Decrypted Successfully\n" + voter_data);
        console.log("*    *    *");

        res.status(200).send(voter_data);
    }
    catch(err){
        res.status(404).send(err);
    }
    //res.status(200).send("Profile");
});

/*router.get('/:x/:y', (req, res) => {
    res.send(
        {name : req.params.x,
        age : req.params.y}
    )
});*/

module.exports = router;