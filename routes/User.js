const express = require("express");
const router = express.Router();

router.get('/dashboard', (req, res) => {
    console.log(req.body);
    res.status(200).send("User Dashboard");
});

/*router.get('/:x/:y', (req, res) => {
    res.send(
        {name : req.params.x,
        age : req.params.y}
    )
});*/

module.exports = router;