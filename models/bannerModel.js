const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:[{
        type:String,
        required:true
    }],
    url:{
        type:String
    },
    description:{
        type:String
    },
    is_active:{
        type:Boolean,
        default:false
    },
    is_deleted:{
        type:Boolean,
        default:false
    },date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("banner",bannerSchema)