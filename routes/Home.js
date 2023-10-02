const express = require("express");
const router = express.Router();
const {createVoter, registerVoter} = require('../controllers/voterID.js');

router.post('/voterIdApplication', async (req, res) => {
    createVoter(req.body);
    registerVoter(req.body);
    res.status(200);
});

module.exports = router;