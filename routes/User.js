require('dotenv').config();
const express = require("express");
const router = express.Router();

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
    
    //console.log("This is ID  - " + req.params.id);
    try{
        const data = await getData(req.params.id);
        //console.log(data)

        res.status(200).send(data);
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