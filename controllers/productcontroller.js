const catModel = require("../models/categorymodel");
const productModel = require("../models/productModel");


// !Add product
const addProduct = async(req,res)=>{
 
 
    try {
      let imagearray =[];
      for(let i=0;i<req.files.length;i++){
        imagearray[i]=req.files[i].filename;
      }
      let productdetails = new productModel({
        name:req.body.productName,
        price:req.body.productPrice,
        stock:req.body.productStock,
        category:req.body.proCategory,
        image:imagearray,
        description:req.body.proDescription
      });
      const products = await productModel.findOne({name:req.body.productName});
      const catdata = await catModel.find()
      if(!products){
        productdetails.save().then((data)=>{
          console.log('Product Added');
          res.redirect("/admin/productManagement");
        });
      }else{
        console.log("product already exists");
        res.render("admin/addproduct",{catdata,message:"This Product is already added"})
      }
  
    } catch (error) {
      console.log(error);
    }
  }
  const getAddProduct =async(req,res)=>{

    try {
  console.log("haii there....");
        const catdata = await catModel.find()
     
        res.render("admin/addproduct",{catdata})
     
    } catch (error) {
      console.log(error);
    }
  }
  // !  PRODUCT MANAGEMENT
const loadProduct = async(req,res)=>{
    try {
      console.log("hello product");
        const productDatas = await productModel.find().populate('category');
        res.render("admin/productmanagement",{productDatas});
      
     console.log("im going");
    } catch (error) {
      console.log(error);
    }
  
  }
  // !!!!! Get edit Product
const getEditProduct = async(req,res)=>{
    try {
    
        console.log("get edit product");
      const id = req.query.id;
      const productdata = await productModel.findOne({_id:id}).populate('category')
      const catdata = await catModel.find();
      // console.log(productdata);
      res.render('admin/editproduct',{catdata,productdata});
      
    } catch (error) {
      console.log(error);
    }
  }
  const applyEditProduct = async(req,res)=>{
    try {
      console.log("im in edit Product");
      const id = req.query.id;
      console.log(id);
      let imagearray =[];
      for(let i=0;i<req.files.length;i++){
        imagearray[i]=req.files[i].filename;
      }
     
      const product ={
        name:req.body.editproductName,
        price:req.body.editproductPrice,
        stock:req.body.editproductStock,
        image:imagearray,
        category:req.body.editproCategory,
        status:req.body.editStatus,
        description:req.body.editproDescription
      }
      
      const pro = await productModel.updateOne({_id:id},{$set:{
        name:product.name,
        price:product.price,
        stock:product.stock,
        image:product.image,
        category:product.category,
        status:product.status,
        description:product.description
      }}).then((data)=>{
        res.redirect("/admin/productManagement");
      
      })
      console.log(data);
     
    } catch (error) {
      console.log(error);
    }
  }
  // !!! enable product
const enableProduct = async(req,res)=>{
    try {
      const product = req.body.proId;
      const productData = await productModel.updateOne({_id:product},{$set:{status:"Active"}})
      res.json({success:true})
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!!delete Product 
const changeProStatus = async(req,res)=>{
    try {
      const id = req.body.proId;
      const proDatas = await productModel.updateOne({_id:id},{status:"Disabled"})
      const proud = await productModel.find({_id:id},{_id:0,status:1})
      console.log(proud,".....");
        res.json({success:true,proud})
    
  
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    addProduct,
    getAddProduct,
    loadProduct,
    getEditProduct,
    applyEditProduct,
    enableProduct,
    changeProStatus

}