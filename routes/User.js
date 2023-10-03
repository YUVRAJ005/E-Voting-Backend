const express = require("express");
const router = express.Router();
const Voter = require("../models/Voter");

router.get('/profile/:id', async (req, res) => {
    
    console.log(req.params.id);
    try{
        const usr = await Voter.find({ email: req.params.id});
        res.status(200).send(usr[0]);
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