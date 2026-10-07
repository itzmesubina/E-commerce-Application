
const catModel = require("../models/categorymodel");

const loadCategory = async(req,res)=>{
    try {
  
  
        const catdetails = await catModel.find();
        const catCount = await catModel.find({},{status:"Active"}).count();
        res.render("admin/categorymanagement",{catdetails,catCount}); 
        console.log("in load category");
     
      
    } catch (error) {
      console.log(error);
    }
  
  }

  const insertCategory = async(req,res)=>{
    try {
    
        res.render("admin/insertCategory");
        console.log("in insert category");
  
    } catch (error) {
      console.log(error);
    }
  }
  
// !!!!!!!!!!!!!!!!!!!! Adding category !!!!!!!!!!!!!!!!!!!!!!!
const addCategory = async(req,res)=>{
    console.log("cat");
    try {
      const catData = new catModel({
        categoryName:req.body.catName.toString(),
        description:req.body.description.toString(),
      })
  
      const categoryName = await catModel.findOne({categoryName:catData.categoryName});
      if(!categoryName){
        console.log(categoryName);
            catData.save().then((catData)=>{
              console.log("category Added");
              console.log(catData);
              res.redirect("/admin/category");
            })
          
      }else{
        
        res.render("admin/insertCategory",{message:"This Category Name is already exists"})
      }
      
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!!!!!!  GET EDIT CATEGORY
const getEditCategory = async(req,res)=>{
    try {
     
        console.log("In edit category");
        const id= req.query.id;
        const thecat = await catModel.findOne({_id:id})
          res.render("admin/editcategory",{catData:thecat});
      
      
  
    } catch (error) {
      console.log(error);
    }
  };
  
// ! Apply the editing of category
const applyEditCat = async(req,res)=>{ 
    try {
      const id = req.query.id;
      console.log(id);
       const categoryname = req.body.catEditName;
       const categoryDescription = req.body.Editdescription;
       console.log(categoryname,categoryDescription);
      const editedCat = await catModel.updateOne({_id:id},{$set:{
        categoryName:categoryname,
        description:categoryDescription
      }}).then((data)=>{
        res.redirect("/admin/category");
        console.log("success");
      })
     
    } catch (error) {
      console.log(error);
    }
  }
  
// !!!! DELETE CATEGORY
const deleteCategory = async(req,res)=>{
    try {
  
      const catid = req.body.catData;
      console.log(catid);
      const catdatas = await (await catModel.updateOne({_id:catid},{$set:{status:"dead"}}))
        res.json({success:true})
     
  
    } catch (error) {
      console.log(error);
    }
  }

  // !!!Active category
  const catActive = async(req,res)=>{
    try {
      const catId = req.body.catId;
      await catModel.updateOne({_id:catId},{$set:{status:"Active"}})
      res.json({success:true})
      
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
  
    loadCategory,
    insertCategory,
    addCategory,
    getEditCategory,
    applyEditCat,
    deleteCategory,
    catActive
}