const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    user_Id:{
        type:String,
        ref:'User',
        required:true
    },
    products:[{
            product:{
                type:ObjectId,
                ref:'Product' 
            },
            quantity:{ 
                type:String,
                default:1
            },
            totalPrice:{
                type:Number,
                default:0
            }
    }],
    Subtotal:{
        type:Number,
        required:true
    },
    address:{
            fname:{type:String},
            lname:{type:String},
            phone:{type:String},
            house:{type:String},
            locality:{type:String},
            hometown:{type:String},
            city:{type:String},
            state:{type:String},
            country:{type:String},
            pin:{type:Number}
        },
    paymentMethod:{
        type:String,
        
    },
    paymentStatus:{
        type:String,
        default:"pending"
    },
    orderStatus:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }

},{
    timestamps:true
});
module.exports = mongoose.model("Order",orderSchema);