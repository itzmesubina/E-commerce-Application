const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({

    categoryName:{
        type:String,
        required:true,
        lowercase:true,
        unique:true

    },
    description:{
        type:String,
        lowercase:true,
        required:true
    },
    status:{
       type:String,
        default:"Active"
    },
    
   
},
{ 
    timestamps:true
});

module.exports = mongoose.model("Category",categorySchema);