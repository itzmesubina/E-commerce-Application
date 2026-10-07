const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },  
    category:{
        type:String,
        ref:'Category',
        required:true,
    },
    image:{
        type:Array,
        required:true,
    },
    description:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    status:{
        type:String,
        default:"Active"
    }
    
},{
    timestamps:true
});
module.exports = mongoose.model("Product",productSchema);