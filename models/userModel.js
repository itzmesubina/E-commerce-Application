const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required: true,
        lowercase:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        
    },
    access:{
        type:String,
        default:"active",
    },
    cart:{
        items:[{
            Product_Id:{
               type:String,
                ref:'Product'
            },
            qty:{
                type:Number,
                default:0
            },
            price:{
                type:Number,
                default:0
            },
            date:{
                type:Date,
                default:Date.now
            }

        }],
        totalPrice:{
            type:Number,
            default:0
        },
        discount:{
            type:Number,
            default:0
        }
    },
    address:[{
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
    }],
    wishlist:{
        products:[{
            product:{
                type:String,
                ref:'Product'
            }
        }]
    },
    usedCoupons:[{
        couponCode:{
            type:String
        }
        
    }],

    
    isVerified:false,
    
}, 
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);
 