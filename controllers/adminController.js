const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const catModel = require("../models/categorymodel");
const productModel = require("../models/productModel");
const Banner = require("../models/bannerModel")
const Coupon  = require("../models/couponModel")
const Order = require("../models/orderModel")



// ! Load admin Login
const adminSignin = async (req, res) => {
  console.log("this is login page");

  try {
    if(req.session.adminId){
      res.redirect('admin/dashboard');

    }else{
      res.render("admin/adminsignin");
    }
    
  } catch (error) {
    console.log(error.message);
  }
};
// !!!Admin Verification  
const adminVerify = async (req, res) => {
  
  try {
    const email =req.body.adminEmail;
   
    const adminData = await Admin.findOne({email:email});
    console.log(adminData);
    if(adminData){
      const password = req.body.adminPassword;
      if(adminData.password===password){
        const isAdmin= await adminData.isAdmin;
        console.log(isAdmin);
        // const adminStatus= true;
        if(adminData.isAdmin){
          console.log("this is Dashboard");
          req.session.adminId  =true;
            res.redirect("/admin/adminDashboard");
          
        console.log("Admin login successful"); 
        }
        else{
          res.render("admin/adminsignin",{message:"Server error found...Please contact with the developer"})
        }
        
      }else{
        res.render("admin/adminsignin",{message:" Password is incorrect ! ! ! !"})
      }
    }else{
      res.render("admin/adminsignin",{message:" Email or password is incorrect ! ! ! !"})
      console.log("Admin data not getting");
    }
    
  } catch (error) {
    console.log(error.message);
  }

}
// !  Load user management

const  adminDashboard = async(req,res)=>{
  try {
    let userCount = await User.find().count();
    let userDatas = await User.find()
    // console.log(userDatas);
    if(req.session.adminId){
      res.render("admin/usermanagement",{userDatas,userCount});
      
    }else{
      res.redirect('/admin');
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

// !block the user
const clickBlock = async(req,res)=>{
 
  try {
    const id=req.params.id;
     await User.updateOne({_id:id},{$set:{access:"blocked"}});
    res.redirect("/admin/dashboard");
  
  } catch (error) { 
  
    console.log(error.message);
  }
}

// !Unblock user

const clickUnBlock =async(req,res)=>{
 
try {
  const id = req.params.id;
  await User.updateOne({_id:id},{$set:{access:"active"}});
    res.redirect("/admin/dashboard");
  
} catch (error) {

  console.log(error.message);
}

}



const loadDashboard = async(req,res)=>{
  try {
    res.render("admin/usermanagement");
    
  } catch (error) {
    console.log(error);
  }
}

// !!! Get Admin Dashboard

const getAdminDashboard = async(req,res)=>{
  try {
    const userCount = await User.find().count()
    const productCount  = await productModel.find().count()
    const sales = await Order.find({orderStatus:"Delivered"}).count()
    const saleDummy = await Order.find().count()
    const order = await Order.find().populate('products.product')
    const revenue = await Order.aggregate([{
      $match:{
        orderStatus:"Delivered"
      }},
        {$group:{
          _id:null,
          totalIncome:{$sum:"$Subtotal"}
      }
    }])

    const orderConf = await Order.find({orderStatus:"Confirmed"}).count()
    const orderCancel = await Order.find({orderStatus:"Canceled"}).count()
    const orderDeli = await Order.find({orderStatus:"Delivered"}).count()
    const orderReturn = await Order.find({orderStatus:"Returned"}).count()
   
let totalPrice;
if(revenue.length>0){
   totalPrice = revenue[0].totalIncome;
}

    res.render("admin/dashboard",{
      userCount,
      productCount,
      sales,
      totalPrice,
      order,
      orderConf,
      orderCancel,
      orderDeli,
      orderReturn,
      saleDummy
    })
  } catch (error) {
    console.log(error);
  }
}

// !!!!! Admin logout 

const adminLogout = async(req,res)=>{
  try {
    req.session.adminId=null;
    res.redirect("/admin")
    
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  adminSignin,
  adminVerify,
  loadDashboard,
  adminDashboard,
  clickBlock,
  clickUnBlock,
  getAdminDashboard,
  adminLogout,
};
