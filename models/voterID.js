const voterIDSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    },
    age : {
        type:Number,
        required: true
    },
    address : {
        type:String,
        required: true
    },
    aadhaar : {
        type:Number,
        required: true
    },
    phone : {
        type:Number,
        required: true
    },
    email : {
        type:String,
        required: true
    }
})

const Voter  = mongoose.model("voter", voterIDSchema);
