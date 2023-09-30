const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send(
        "HomePage"
    )
});

router.get('/:x/:y', (req, res) => {
    res.send(
        {name : req.params.x,
        age : req.params.y}
    )
});

module.exports = router;