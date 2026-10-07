const Coupon  = require("../models/couponModel")


// !!!!!coupon 
const gatCoupon = async(req,res)=>{
    try {
     
        const couponData = await Coupon.find()
        res.render('admin/couponmanagemant',{couponData});
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!!Add coupon

const getAddCoupon = async(req,res)=>{
    try {
      
      res.render('admin/addcoupon')
  
    } catch (error) {
      console.log(error);
    }
  }
// !!!Apply coupon

const addCoupon = async(req,res)=>{
    try {
      const couponcode = req.body.couponcode;
      const couponData = new Coupon({
        code:req.body.couponcode,
        available:req.body.available,
        amount:req.body.amount,
        minAmount:req.body.minAmount,
        expiry:req.body.expiryDate,
        status:req.body.couponstatus
      })
      const coupdata = await Coupon.findOne({code:couponcode});
      if(!coupdata){
        couponData.save().then((data)=>{
          res.redirect('/admin/couponManagement')
        })
      }else{
        res.render('admin/addcoupon',{message:"This coupon already Applied"})
        
      }
     
    } catch (error) {
    
      console.log(error);
    }
  }
// !!!!!edit coupon

const geteditcoupon = async(req,res)=>{
    try {
      const id = req.query.id;
      console.log(id);
      const coupondata = await Coupon.findOne({_id:id})
       res.render('admin/editcoupon',{coupondata})
     
    } catch (error) {
      console.log(error);
    }
  }
  // !!!! Submit Edit coupon
const submitEditCoupon = async(req,res)=>{
    try {
      const id = req.query.id;
      
      const data = {
        code:req.body.eidtedcode,
        available:req.body.editedavail,
        amount:req.body.editedamount,
        minAmount:req.body.editedMinAmount,
        expiry:req.body.editedexpiry,
        status:req.body.editedstatus
      };
    
      const updated = await Coupon.updateOne({_id:id},{$set:{code:data.code,available:data.available,amount:data.amount, minAmount:data.minAmount,expiry:data.expiry,status:data.status}}).then((data)=>{
        res.redirect("/admin/couponManagement")
      })
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!  Delete Coupon
const deleteCoupon = async(req,res)=>{

    try {
      const id = req.body.couponid;
      const coupondata = await Coupon.deleteOne({_id:id}).then((data)=>{
        res.json({success:true})
      })
      
    } catch (error) {
      console.log(error);
    }
  }
module.exports = {
    gatCoupon,
    getAddCoupon,
    addCoupon,
    geteditcoupon,
    submitEditCoupon,
    deleteCoupon
}