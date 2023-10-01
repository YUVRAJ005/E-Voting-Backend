const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body);
    res.status(200).send({a : "Voter Application Submitted Successfully"});
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).send({a : "Voter Application Submitted Successfully"});
});

router.get('/:x/:y', (req, res) => {
    res.send(
        {name : req.params.x,
        age : req.params.y}
    )
});

module.exports = router;