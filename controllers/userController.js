const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const products = require("../models/productModel");
const category = require("../models/categorymodel");
const Banenr = require("../models/bannerModel");
const Coupon = require("../models/couponModel.js");
const Order = require('../models/orderModel.js');
const {validationResult}=require("express-validator")
const { response } = require("../routers/adminRoute");
const Razorpay = require('razorpay');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,

  auth: {
    user: "digicartbyabhinav@gmail.com",
    pass: "oxjmjfzxfyjwdpzs",
  },
});
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

//   *************************************

const userLogin = (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.render("users/signin",{});
    }
  } catch (error) {
    console.log(error);
  }
};

const userSignup = async (req, res) => {
  try {
    res.render("users/signup");
  } catch (error) {
    console.log(error);
  }
};

// todo:OTP
const insertUser = async (req, res) => {
  try {
    console.log("haiiiiii", req.body);
    req.session.fName = req.body.firstname;
    req.session.lName = req.body.lastname;
    req.session.email = req.body.email;
    req.session.mobile = req.body.mobile;
    req.session.password = req.body.password;
    //   const Email = req.body.email;

    const user = await User.findOne({ email: req.session.email });
    console.log(user, "hiiiiiihere");
    if (!user) {
      console.log("no user");

      // send mail with defined transport object
      var mailOptions = {
        from: "digicartbyabhinav@gmail.com",
        to: req.body.email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.redirect("otp");
      });
    } else {
      res.render("users/signup", {
        userWarning: "This email is already exists.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//   !comparing otp

const checkOtp = async (req, res) => {
  try {
    if (req.body.otp == otp) {
      const UserPassword = await bcrypt.hash(req.session.password, 10);
      let newUser = new User({
        firstName: req.session.fName,
        lastName: req.session.lName,
        email: req.session.email,
        mobile: req.session.mobile,
        password: UserPassword,
      });

      console.log(newUser);
      newUser.save().then((data) => {
        console.log(data, "oooo");
      });

      res.redirect("/");
    } else {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error);
  }
};

// !! Getting user otp page
const getOtp = async (req, res) => {
  try {
    res.render("users/otp", { otpmail: req.session.email });
  } catch (error) {
    console.log(error);
  }
};

// !   Load user signup page
const loadSgnup = async (req, res) => {
  try {
    res.render("users/signin",{errorMessage:errorMs[0]});
  } catch (error) {
    console.log(error);
  }
};
// ! Load the user Home page
const loadHome = async (req, res) => {
  try {
    let login = false;
    if (req.session.user) {
      login = true;
    }
    const bannerData = await Banenr.find({ is_deleted: "false" })
    const productData = await products.find({status:"Active"}).populate("category").limit(8);
    res.render("users/home", { productData, login, bannerData,block:true});
  } catch (error) {
    console.log(error);
  }
};
// !!!! GET ALL PRODUCT LIST
const getAllProducts = async (req, res) => {
  try {
    let page=1;
    const limit = 8;
    let login = req.session.user;
    const count = await products.find({status:"Active"}).count()
    if(req.query.page){
      page = req.query.page

    const ProductData = await products.find({status:"Active"}).populate("category").limit(limit*1).skip((page-1)*limit).exec()
    res.json({ProductData,totalPage:Math.ceil(count/limit)})
    }else{

      const ProductData = await products.find({status:"Active"}).populate("category").limit(limit*1).skip((page-1)*limit).exec()
      res.render("users/showallproducts", { ProductData, login,totalPage:Math.ceil(count/limit)});
      
    }
  } catch (error) {
    console.log(error);
  }
};

// !!!Search product
const  searchProduct = async(req,res)=>{
  try {

    let search = "";
    let page = 1;
    const limit = 5;

    if (req.query.page) {
      page = req.query.page;
     
    }
    console.log(page,"page is here..");
    console.log("hello");
  
   let productQuery = { list: 0 };    
  
    if (req.body.product) {
      search = req.body.product;
     productQuery={ name: { $regex: ".*" + search + ".*", $options: "i" } }
  
    }
    const count = await products.find().count()
    if(productQuery.list==0){
      data = await products.find()
      res.json({ product: data,totalPage:Math.ceil(count/limit) });
  }else{
    let data = await products.find(productQuery).populate("category")
    .limit(limit)
    .skip((page - 1)*limit)
    .exec();
    console.log(data); 
    res.json({ product: data,totalPage:Math.ceil(count/limit)});
  }
  } catch (error) {
    console.log(error);
  }
}

// !Login verification
const  verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422).render("users/signin",{errorMessage:errors.array()[0].msg})
    }
    const userMail = await User.findOne({ email: email });
    console.log(userMail);
    if (userMail) {
      if (userMail.access === "active") {
        if (userMail) {
          const passMatch = await bcrypt.compare(password, userMail.password);
          if (passMatch) {
            req.session.user = userMail;
            res.redirect("/");
          } else {
            res.render("users/signin", { message: "Password Not Matching" });
            console.log("passWord does'nt Match");
          }
        }
      } else {
        res.render("users/signin", { message: "Your Account is Blocked" });
      }
    } else {
      res.render("users/signin", {
        message: `You are not Registered.Click the Signup to Register`,
      });
      console.log("Email not matching");
    }
  } catch (error) {
    console.log(error);
  }
};

// !!!single product getting
const getSingleProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const productData = await products.findById({ _id: id });
    const categoryData = await category.find();
    let login = req.login ? true : false;
    if(!productData){
        res.render("users/404",{message:"Internal error found, try after some time"})
    }else{
    res.render("users/singleproduct", { productData, categoryData, login });
    }
  } catch (error) {
    console.log(error);
  }
};

// !!!!! USER CART MANAGEMENT
const getUserCart = async (req, res) => {
  try {
    if (req.session.user) {
      const ProductId = req.query.id;
      let login = true;
      const id = req.session.user._id;
      const use = await User.findById(id);
    
      const userData = await use.populate("cart.items.Product_Id");

      const proStock = await User.findOne({_id:id},{"cart.items.Product_Id":1,_id:0}).populate("cart.items.Product_Id")
      if(proStock.cart.items.length !=0){
      checkProductStock(proStock)
      async function checkProductStock(proStock) {
        if (proStock.cart.items.length > 0) {
          let cartProductIds = [];
          proStock.cart.items.forEach((element) => {
            cartProductIds.push(element.Product_Id._id);
          });
          let hasZeroStock = false;
          for (const cartProductId of cartProductIds) {
            const productStock = await products.findOne({ _id: cartProductId });
        
            if (productStock.stock <= 0) {
              hasZeroStock = true;
              var itIsId = cartProductId.toString();
              var stock=productStock.name;
              break;
            }
          }
          

          if (hasZeroStock) {
          
            res.render("users/cartmanagement", { login, userData, use, stock,proId:itIsId,block:true});
          } else {
            res.render("users/cartmanagement", { login, userData, use ,block:true});
          }
        }
      }
    }else{
      res.render("users/cartmanagement", { login, userData, use ,block:true});
    }

     
    } else {
      res.redirect("/signin");
    }
  } catch (error) {
    
    console.log(error);
  }
};
// !!! USER ADD TO CART
const getAddToCart = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    if (req.session.user) {
      const productData = await products.findById({ _id: id });
      const userId = req.session.user._id;
      const userData = await User.findById({ _id: userId });

      const indexNumber = userData.cart.items.findIndex((productItem) => {
        return (
          new String(productItem.Product_Id).trim() ==
          new String(productData._id).trim()
        );
      });
      console.log(indexNumber, "index ivde");
      // todo:If the same cart data already in the database
      if (indexNumber >= 0) {
        console.log("in  increment state");
        userData.cart.items[indexNumber].qty += 1;

        userData.cart.totalPrice =
          userData.cart.items[indexNumber].qty * productData.price;
        await userData.save().then((data) => {
          res.redirect("/");
        });
      } else {
        const cartData = await User.updateOne(
          { _id: userId },
          {
            $push: {
              "cart.items": {
                Product_Id: productData._id,
                qty: 1,
                price: productData.price,
              },
             },
            $inc: { "cart.totalPrice": productData.price },
          }
        ).then((data) => {
          console.log("user cart updated with userId:", userId);
          res.redirect("/cartmanagement");
          console.log(data);
        })

        const deletedWish= await  User.updateOne({ _id: userId },{
            $pull:{
              "wishlist.products":{
                product:id
              }
            }
          })
      }
     
      console.log(updated);
    } else {
      res.redirect("/signin");
    }
  } catch (error) {
    console.log(error);
  }
};

const changeQuantity = async (req, res) => {
  try {
    console.log("hello mahn");
    const userid = req.body.user;
    let proid = req.body.product;
    proid = proid.trim();
    let count = req.body.count;

    count = parseInt(count);

    const productData = await products.findOne({ _id: proid });
   
    if (req.session.user) {
      const cartdataupdate = await User.updateOne(
        { _id: userid, "cart.items.Product_Id": proid },
        {
          $inc: {
            "cart.items.$.qty": count,
            "cart.totalPrice": productData.price * count,
          },
        },
        { new: true }
      );
      const usercartz = await User.findOne({ _id: req.session.user._id });
      const total = usercartz.cart.totalPrice;

      const productStock = await products.findOne({_id:proid},{_id:0,stock:1})
      console.log(productStock,"Stock is here...");
    
      res.json({ success: true, total,productStock});
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const removeCartItems = async (req, res) => {
  try {
    const Productid = req.body.productId;
    const id = req.session.user._id;
    
    const userData = await User.findById({_id:id})
    const ProductIndex = await userData.cart.items.findIndex((el)=>el.Product_Id==Productid);
    const quantity = {a:parseInt(userData.cart.items[ProductIndex].qty)}

    userData.cart.items[ProductIndex].qty=quantity.a;
    userData.cart.totalPrice -= userData.cart.items[ProductIndex].price*userData.cart.items[ProductIndex].qty;
    userData.cart.items.splice(ProductIndex,1)
    console.log("heeloo");
    const data = await userData.save()
    res.json({success:true})
  } catch (error) {
    console.log(error);
  }
};

//!! if the stock is zero in cart then add to wishlist

const ifWish = async(req,res)=>{
  try {
    const id = req.body.proId;
    console.log(id);
    if(req.session.user){
      const userId = req.session.user._id;
      const productData = await products.findById({_id:id})
      const userdata = await User.findById({_id:userId})
      
      const indexes = userdata.wishlist.products.findIndex((productItem)=>{
        return(
          new String(productItem.product).trim()== 
          new String(productData._id).trim() 
        );
      });
      console.log(indexes);
      if(indexes>=0){
        console.log("it is already there");
      }else{

        console.log("added");
      const wishdata = await User.updateOne({_id:userId},{
        $push:{"wishlist.products":{
          product:productData._id
        }}
      })
        console.log("successfully added to wishlist");
        
    }
    //
    const userData = await User.findById({_id:userId})
    const ProductIndex = await userData.cart.items.findIndex((el)=>el.Product_Id==id);
    const quantity = {a:parseInt(userData.cart.items[ProductIndex].qty)}
    userData.cart.items[ProductIndex].qty=quantity.a;
    userData.cart.totalPrice -= userData.cart.items[ProductIndex].price*userData.cart.items[ProductIndex].qty;
    userData.cart.items.splice(ProductIndex,1)
    console.log("heeloo");
    const data = await userData.save()
    res.json({success:true})
    }else{
      res.redirect("/signin")
    }
  } catch (error) {
    console.log(error);
  }
}

// !!!!!User Account
const getAccount = async (req, res) => {
  try {
    let login = true;
    if (req.session.user) {
      const userDetails = req.session.user;
      res.render("users/userprofile", { login, userDetails,block:true });
    } else {
      res.redirect("/signin");
    }
  } catch (error) {
    console.log(error);
  }
};

// !! change the user profile
const changeProfile =  async(req,res)=>{
  try {
    if(req.session.user){
      const id = req.session.user._id;
     
      let data = {
        fname:req.body.changeUserFname,
        lname:req.body.changeUserLname,
        mobile:req.body.changeMobNumber
      }
      await User.updateOne({_id:id},{$set:{
        firstName:data.fname,
        lastName:data.lname,
        mobile:data.mobile
      }}).then(()=>{
        console.log("profile changed successfully");
        res.redirect("/account")
      })
    }else{
      res.redirect("/")
    }
    
  } catch (error) {
    console.log(error);
  }
}


// !!! Get Wishlist
const getWishlist = async(req,res)=>{  
  try {
    if(req.session.user){
      const login = req.session.user;
      const id = req.session.user._id;
      
     const userDetails = await User.findOne({_id:id}).populate("wishlist.products.product")
     console.log("You are in wishlist Page");
     res.render("users/wishlist",{login,userDetails,block:true})
    }else{
      res.redirect('/signin')
    }

  } catch (error) {
    console.log(error);
  }
}
// !! Add to Wishlist
const getAddToWishlist = async(req,res)=>{
  try {
  
    const id = req.query.id;
    console.log(id);
    if(req.session.user){
      const userId = req.session.user._id;
      const productData = await products.findById({_id:id})
      const userdata = await User.findById({_id:userId})
      
      const indexes = userdata.wishlist.products.findIndex((productItem)=>{
        return(
          new String(productItem.product).trim()== 
          new String(productData._id).trim() 
        );
      });
      console.log(indexes);
      if(indexes>=0){
        console.log("it is already there");
      }else{

        console.log("added");
      const wishdata = await User.updateOne({_id:userId},{
        $push:{"wishlist.products":{
          product:productData._id
        }}
      }).then((data)=>{
        console.log("successfully added to wishlist");
        res.redirect("/wishlist");
      })
    }


    }else{
      res.redirect("/signin")
    }
    
  } catch (error) {
    console.log(error);
  }
}
// !!! Remove Wish item

const removeWishItem = async(req,res)=>{
  try {
   const proId =  req.body.proId; 
   const id = req.session.user._id;
   console.log(id ,"user id");
   console.log(proId,"pro id");
    const userData = await User.updateOne({_id:id},{$pull:{"wishlist.products":{product:proId}}})
  res.json({success:true})
  } catch (error) {
    console.log(error);
  }
}
//!!! Load user Address

const getUserAddress = async(req,res)=>{
  try {
    console.log("you are in  address area");
    const login =req.session.user;
    const id = req.session.user._id;
    const userDetails = await User.findOne({_id:id})
    res.render("users/useraddress",{login,userDetails,block:true});
    
  } catch (error) {
    console.log(error);
  }
}
// !!!! Add User Address
const addAddress = async(req,res)=>{
  try {

    const login = req.session.user;
    if(req.session.user){
      const id = req.session.user._id;
      const address={
        fname:req.body.fname,
        lname:req.body.lname,
        phone:req.body.phNumber,
        house:req.body.homeAdd,
        locality:req.body.locality,
        hometown:req.body.homeTown,
        city:req.body.city,
        state:req.body.state,
        country:req.body.country,
        pin:req.body.pinCode
      };
  
        const adressdata = await User.updateOne({_id:id},{$push:{address:{
          fname:address.fname,
          lname:address.lname,
          phone:address.phone,
          house:address.house,
          locality:address.locality,
          hometown:address.hometown,
          city:address.city,
          state:address.state,
          country:address.country,
          pin:address.pin
        }}}).then((data)=>{
          res.redirect("/userAddress");
          console.log("address added successfully");
        })
        
    }else{
      res.redirect("/signin")
    }
    
  } catch (error) {
    console.log(error);
  }
}
// !!!! Delete Address
const deleteAddress = async(req,res)=>{
  try {
    console.log("You are inside delete Address");
    const id = req.body.addressId;
    console.log(id);
    const addressDetails = await User.updateOne({_id:req.session.user._id},{$pull:{
      address:{
        _id:id
      }
    }}).then((data)=>{
      res.json({success:true})
      console.log("Address deleted");
    })
   
  } catch (error) {
    console.log(error);
  }
}
// !!! Get check out page
const getCheckOut = async(req,res)=>{
  try {
    if(req.session.user){
      
      const login = req.session.user;
      const id = req.session.user._id;
      const cartdata = await User.findOne({_id:id,cart:{$exists:true}})
    
      const userAddress = await User.findById({_id:id});
      const userDescount= await User.updateOne({_id:id},{$set:{"cart.discount":0}})
      const user = await User.findById({_id:id}).populate('cart.items.Product_Id');
      if(cartdata==null){
        res.redirect("/cartmanagement")
      }else{
        res.render("users/checkout",{login,userAddress,user,block:true})
      }
       
    }else{
      res.redirect("/signin")
    }

  } catch (error) {
    console.log(error);
  }
}
// !!!!  Apply coupon
const applyCoupon = async(req,res)=>{
  try {
    if(req.session.user){
      const id = req.session.user._id;
      const coupon = req.body.coupon;
      console.log(coupon);
      
      const userDetails = await User.findOne({_id:id})
      const cartTotal = userDetails.cart.totalPrice;
      const checkCoupon = await Coupon.findOne({code:coupon});
      const couponStatus = await Coupon.findOne({code:coupon,status:"Active"});
     const usedCoupons = await User.findOne({_id:id,"usedCoupons.couponCode":coupon})
    
      if(checkCoupon){
        if(couponStatus){
          if(!usedCoupons){
          const couAvail = checkCoupon.available;
          if(checkCoupon.minAmount<cartTotal){
            if(couAvail>0){
            const couponexp =checkCoupon.expiry;
            const date =new Date()
            console.log(couponexp);
            console.log(date);
            if(couponexp>date){
              req.session.coupon = coupon;
              const couponAmount = checkCoupon.amount;
              await User.updateOne(
                  { _id: id },
                  { $set: { "cart.discount": couponAmount  } }
                );
                const user = await User.findOne({_id:id})
                const coupAmount = user.cart.discount;
                const theAmount = cartTotal-couponAmount;
      
                res.send({success:true,coupAmount,theAmount,message1:"Coupon Added Successfully"})
             
            }else{
             
              res.send({message:"Coupon Expired",coupAmount:0,theAmount:cartTotal})
            }
          }else{
            res.send({message:"Coupon Not Available",coupAmount:0,theAmount:cartTotal})
          }
        }else{
          res.send({message:"Coupon Not Available for This Total Amount",coupAmount:0,theAmount:cartTotal})
        }
        }else{
          res.send({message:"This Coupon is Already Used,Try Another One!!",coupAmount:0,theAmount:cartTotal})
        }
      }else{
        res.send({message:"Coupon Is Not There",coupAmount:0,theAmount:cartTotal})
      }
    }else{
      res.send({message:"Coupon Not Matching",coupAmount:0,theAmount:cartTotal})
    }
    
  }else{
    res.redirect("/signin")
  }
  } catch (error) {
    console.log(error);
  }
}
// !!!! SUBMIT CHECKOUT
const submitCheckout= async(req,res)=>{
  try {
    console.log(req.session.coupon);
    console.log("lets submit");
    const id = req.session.user._id;
    const firstName = req.body.fname ;
    const lastName = req.body.lname;
    const phoneNo = req.body.phoneNo;
    const homeAdd = req.body.homeAdd;
    const locality = req.body.locality;
    const homeTown = req.body.homeTown;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const pin = req.body.pin;
    const payment = req.body.payment;
    console.log(payment,"this is the payment methods");

    const cartData = await User.findOne({_id:id}).populate('cart.items.Product_Id')
    const cartTotal = cartData.cart.totalPrice;
    const cartDiscount = cartData.cart.discount;
    const orderSubTotal = cartTotal-cartDiscount;
    console.log(cartData.cart.items,"hello this is cart data");

    const productsData = cartData.cart.items.map(item => ({
      product: item.Product_Id._id,
      quantity: item.qty,
      totalPrice: item.price,
    }));
    
  const orderData = await Order({
    user_Id:id,
    products:productsData,
    Subtotal:orderSubTotal,
    address:{
      fname:firstName,
      lname:lastName,
      phone:phoneNo,
      house:homeAdd,
      locality:locality,
      hometown:homeTown,
      city:city,
      state:state,
      country:country,
      pin:pin
    },
    orderStatus:"Confirmed",
  })

  await orderData.save()
 

  const OrderId = await Order.findOne({}).sort({date:-1}).limit(1)
  console.log(OrderId._id,"OO this is the Id");

    
  if(payment=="COD"){
    
    console.log("cod");
      
      
      await Order.updateOne({_id:OrderId._id},{$set:{paymentMethod:"COD"}})
      
        console.log(req.session.coupon,"coupon data");
        if(!req.session.coupon){
          console.log("coupon is null");
        }else{
        await  User.updateOne({_id:id},{$push:{usedCoupons:{couponCode:req.session.coupon}}})
        const aboutCoupon =  await Coupon.updateOne({code:req.session.coupon},{$inc:{available:-1}})
        console.log("nenu gothilla...");
        }
        req.session.coupon = "";
        const userData = await User.findById(req.session.user._id)
        const cartProducts = userData.cart.items
        for(let i=0;i<cartProducts.length;i++){
        let singleProduct = await products.findById(cartProducts[i].Product_Id)
          singleProduct.stock -= cartProducts[i].qty
          singleProduct.save()
        }
        const  UserCart = await User.updateOne({_id:id},{$unset:{cart:{$exists:true}}}).then((data)=>{
          console.log("Cart Removed Successfully");
        })

        res.send({codsuccess:true,cod:true}) 
  }else{
    var instance = new Razorpay({
      key_id: 'rzp_test_TbTb7oC9Inl1BD',
      key_secret: 'BCooqzz87I7YqhqDuweteLRq',
    });

    var options = {
      amount:orderSubTotal*100 ,
      currency:"INR",
      receipt:""+OrderId._id
    }
    instance.orders.create(options, function(err,order){
      console.log(order,"hello... Placed");
      if(err){

      }else{
        res.json({success:true,order})
      }
    })
    console.log("Online");
  }
 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
// !! Verify Razorpay
const verifyPayment = async(req,res)=>{
  try {
    console.log(req.body);
    const id= req.session.user._id;
   const  orderId = req.body.order.receipt;
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256','BCooqzz87I7YqhqDuweteLRq')
    .update(req.body.payment.razorpay_order_id+'|'+req.body.payment.razorpay_payment_id).digest('hex')

    if(hmac ==req.body.payment.razorpay_signature){
      console.log("success");
      await Order.updateOne({_id:orderId,user_Id:req.session.user._id},{$set:{paymentStatus:"Paid",paymentMethod:"Online Payment"}}).then((data)=>{
        res.json({success:true})
      })
      if(!req.session.coupon){
        console.log("online null coupon");
      }else{
        await  User.updateOne({_id:id},{$push:{usedCoupons:{couponCode:req.session.coupon}}})
        const aboutCoupon =  await Coupon.updateOne({code:req.session.coupon},{$inc:{available:-1}})
        console.log("nline nenugothill");
      }
          req.session.coupon = "";

        const userData = await User.findById(req.session.user._id)
        const cartProducts = userData.cart.items
        for(let i=0;i<cartProducts.length;i++){
        let singleProduct = await products.findById(cartProducts[i].Product_Id)
          singleProduct.stock -= cartProducts[i].qty
          singleProduct.save()
        }
       
        const  UserCart = await User.updateOne({_id:id},{$unset:{cart:{$exists:true}}}).then((data)=>{
          console.log("After Online payment,.Cart Removed Successfully");
        })
    }else{
      res.json({paymentFailed:true})
    }
    
  } catch (error) {
    console.log(error);
  }
}

// !!! Select Address
const selectShippingAddress = async(req,res)=>{
  try {
    if(req.session.user){
      const userId = req.session.user._id;
      const id = req.body.addressId;
     
      const userAddress = await User.findOne({_id:userId})
      console.log(userAddress.address,"Address Is here");
      
      const delAddress = userAddress.address.find((address) => {
        return (
          new String(address._id).trim() ==
          new String(id).trim()
        );
      });
      console.log(delAddress,"it is your address");
      res.json({success:true,delAddress})
    }
    
  } catch (error) {
    console.log(error);
  }
}

// !!!! Get Success Page
const getSuccess = async(req,res)=>{
  try {
    if(req.session.user){
    res.render("users/ordersuccess",{block:true});
    }

  } catch (error) {
    console.log(error);
  }
} 
// !!! Get Order Details
const getOrderDetails = async(req,res)=>{
  try {
    if(req.session.user){
      const id = req.session.user._id;
      if(req.session.user){
        const orderData = await Order.find({user_Id:id}).sort({ date: -1 }).limit(1)
        console.log(orderData,"this is the last one ");
        res.render("users/orderDetails")
      }
    }
    
  } catch (error) {
    console.log(error);
  }
}

// !!!!! Order history
const getOrderHistory = async(req,res)=>{
  try {
    if(req.session.user){
      const userDetails = req.session.user;
      const orderDetails = await Order.find({ user_Id:userDetails._id}).sort({date:-1}).populate('products.product')
     
      res.render('users/orderhistory',{userDetails,orderDetails,block:true});
    }else{
      res.redirect("/signin")
    }
    
  } catch (error) {
    console.log(error);
  }
}
// !!!! ordered product details
 
const getOrderProductDetails = async(req,res)=>{
  try {
    console.log("im here");
    const orderId = req.query.id;
    console.log(orderId);
    let login = req.session.user;
    const orderData = await Order.findOne({_id:orderId}).populate('products.product')
    console.log(orderData,"yourdataaaa");
    res.render("users/orderDetails",{login,orderData})
  } catch (error) {
    console.log(error);
  }
}
// !!!!! Cancel Product Order
const userCancelOrder = async(req,res)=>{
  try {
    if(req.session.user){
      const orderId = req.body.orderId;
      const orderData = await (await Order.updateOne({_id:orderId},{$set:{orderStatus:"Canceled"}}))
        res.send({success:true})

    }else{
      res.redirect("/")
    }
    
  } catch (error) {
    console.log(error);
  }
}
// !!!!Return Order
const returnOrder = async(req,res)=>{
  try {
    if(req.session.user){
      const id = req.session.user._id;
      const orderId = req.body.orderId;
      console.log("Deeeeyyyy");
      const reOrder = await Order.findOneAndUpdate({user_Id:id,_id:orderId},{$set:{orderStatus:"Returned"}})

      const reOrderStock = await Order.findOne({_id:orderId})
      console.log(reOrderStock,"order is here");
      reOrderStock.products.forEach(async(items,i) => {
        let orderQty = items.quantity;
         let orderProduct = await products.updateOne({_id:items.product},{$inc:{stock:orderQty}})
         
      });
     
      res.send({success:true})
      
    }
    
  } catch (error) {
    console.log(error);
  }
}
// !!!!user Logout
const userLogout = async (req, res) => {
  try {
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = {
  userSignup,
  insertUser,
  userLogin,
  loadHome,
  verifyLogin,
  loadSgnup,
  getOtp,
  checkOtp,
  getSingleProduct,
  getUserCart,
  getAddToCart,
  changeQuantity,
  removeCartItems,
  ifWish,
  getAccount,
  changeProfile,
  getAllProducts,
  searchProduct,
  getWishlist,
  getAddToWishlist,
  removeWishItem,
  getUserAddress,
  addAddress,
  deleteAddress,
  getCheckOut,
  applyCoupon,
  submitCheckout,
  selectShippingAddress,
  getSuccess,
  getOrderDetails,
  getOrderHistory,
  getOrderProductDetails,
  userCancelOrder,
  returnOrder,
  verifyPayment,

  userLogout,
};


 