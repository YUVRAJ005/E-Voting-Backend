const mongoose = require("mongoose");

const voterIDSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    },
    gender : {
        type:String,
        required: true
    },
    dob : {
        type: String,
        required: true
    },
    age : {
        type: Number,
    },
    phone : {
        type:Number,
        required: true,
        unique: true
    },
    email : {
        type:String,
        required: true,
        unique: true
    },
    address : {
        type:String,
        required: true
    },
    pincode : {
        type:Number,
        required: true,
    },
})

const Voter  = mongoose.model("Voter", voterIDSchema);
module.exports  = Voter;