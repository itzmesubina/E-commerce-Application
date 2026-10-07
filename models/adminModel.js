const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
     email:{
        type:String,
        required:true,
        trim:true,
     },
     password:{
        type:String,
        require:true,
     },
     isAdmin:{
        type:String,
        default:0,
     }
}) ;
module.exports = mongoose.model("Admin",adminSchema);