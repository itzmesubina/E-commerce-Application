const Banner = require("../models/bannerModel")

const getBanner = async(req,res)=>{
    try {
      
        const bannerDatas = await Banner.find()
      
        res.render("admin/bannermanagement",{bannerDatas})
      
     
    } catch (error) {
      console.log(error);
    }
  }
  const addBanner =async(req,res)=>{
    try {
      const bannerdetails = await Banner.find()
        res.render("admin/addBanner",{bannerdetails})
    } catch (error) {
      console.log(error);
    }
  }
// !!!!! Apply Banner

const applyBanner = async(req,res)=>{
    try {
      const bannerData = new Banner({
        title:req.body.bannerTitle,
        description:req.body.bannerDesc,
        url:req.body.urlname,
        image:req.file.filename
      })
      bannerData.save().then((data)=>{
        res.redirect("/admin/BannerManagement")
      })
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!!!Get edit Banner

const getEditBanner = async(req,res)=>{

    try {
      const id = req.query.id;
      console.log(id);
      const bannerdata = await Banner.findOne({_id:id})
      console.log(bannerdata);
      res.render("admin/editBanner",{bannerdata})
    } catch (error) {
      console.log(error);
    }
  }
  // !!!Apply edit Banner

const applyEditBanner = async(req,res)=>{
    try {
      const id = req.query.id;
      console.log(req.body.bannerStatus,"oooogo");
      console.log(id);
      const BannerData = await Banner.updateOne({_id:id},{$set:{
        title:req.body.editBannerTitle,
        image:req.file.filename,
        url:req.body.editUrlname,
        is_deleted:req.body.bannerStatus,
        description:req.body.editBannerDesc
      }}).then((data)=>{
        res.redirect("/admin/BannerManagement")
      })
      
    } catch (error) {
      console.log(error);
    }
  }
  // !delete banner details
const deleteBanner = async(req,res)=>{
    console.log('this is banner')
    const id = req.query.id;
    console.log(id);
    try {
      Banner.updateOne({_id:id},{$set:{is_deleted:"true"}}).then((data)=>{
        res.redirect("/admin/bannermanagement");
        console.log("Banner Deleted Successfully");
      })
    
    } catch (error) {
      console.log(error);
    }
  }
  // !!! Remove the banner
const removeBanner = async(req,res)=>{
    try {
       const banId = req.body.bannerId;
      const remove = await Banner.deleteOne({_id:banId})
      res.json({success:true})
      
    } catch (error) {
      console.log(error);
    }
  }
  
  module.exports = {
    getBanner,
    addBanner,
    applyBanner,
    getEditBanner,
    applyEditBanner,
    deleteBanner,
    removeBanner
  }