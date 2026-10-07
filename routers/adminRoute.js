const express = require("express");
const adminRoute = express();
const session=require('express-session');
const multer = require("multer");
const path = require("path");

const config=require("../config/config");



// todo: using nMulter 
const storage = multer.diskStorage({
     destination:function(req,file,cb){

        cb(null,path.join(__dirname,"../public/Image"))
     },filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name)
     }
})

const upload = multer({storage:storage})
    
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}));
const {verifyAdmin} = require("../middleware/auth")

const adminController = require("../controllers/adminController");
const bannerController = require("../controllers/bannerconroller")
const couponController = require("../controllers/couponcontroller")
const orderController = require("../controllers/ordercontroller")
const productController = require("../controllers/productcontroller")
const categoryController = require("../controllers/categorycontroller")



// Admin get methods

adminRoute.get("/",adminController.adminSignin);
adminRoute.get("/dashboard",verifyAdmin,adminController.adminDashboard);
adminRoute.get("/category",verifyAdmin,categoryController.loadCategory);
adminRoute.get("/insertCategory",verifyAdmin,categoryController.insertCategory);
adminRoute.get("/editCategory",verifyAdmin,categoryController.getEditCategory);

adminRoute.get("/productManagement",verifyAdmin,productController.loadProduct);
adminRoute.get("/addNewproduct",verifyAdmin,productController.getAddProduct);
adminRoute.get("/addProduct",verifyAdmin,productController.getAddProduct);
adminRoute.get("/editProduct",verifyAdmin,productController.getEditProduct);
adminRoute.post("/changeProductStatus",verifyAdmin,productController.changeProStatus);
adminRoute.post("/enableProduct",verifyAdmin,productController.enableProduct);


adminRoute.get("/BannerManagement",verifyAdmin,bannerController.getBanner);
adminRoute.get("/addBanner",verifyAdmin,bannerController.addBanner);

adminRoute.get('/editBanner',verifyAdmin,bannerController.getEditBanner);
adminRoute.get("/deleteBanner",verifyAdmin,bannerController.deleteBanner);
adminRoute.post("/removeBanner",verifyAdmin,bannerController.removeBanner);

adminRoute.get("/couponManagement",verifyAdmin,couponController.gatCoupon);
adminRoute.get('/addcoupon',verifyAdmin,couponController.getAddCoupon);
adminRoute.get('/editCoupon',verifyAdmin,couponController.geteditcoupon);
// todo:Admin Order Management
adminRoute.get("/orderManagement",verifyAdmin,orderController.getOrderManagement);
adminRoute.post("/changeOrderStatus",verifyAdmin,orderController.postStatusChanges)
adminRoute.post("/generateSalesReport",verifyAdmin,orderController.downSalesReport)
// todo: Admin Logout
adminRoute.get("/adminLogout",verifyAdmin,adminController.adminLogout)


// Admin post methods
adminRoute.post("/",adminController.adminVerify);
adminRoute.post("/userManagement",verifyAdmin,adminController.loadDashboard);
adminRoute.post("/clickBlock/:id",verifyAdmin,adminController.clickBlock);
adminRoute.post("/clickUnblock/:id",verifyAdmin,adminController.clickUnBlock);
adminRoute.post("/insertCategory",categoryController.addCategory);

adminRoute.post("/applyEditCategory",categoryController.applyEditCat);
adminRoute.post("/deleteCategory",verifyAdmin,categoryController.deleteCategory);
adminRoute.post("/catActive",verifyAdmin,categoryController.catActive)

adminRoute.post("/submitCoupon",verifyAdmin,couponController.addCoupon);
adminRoute.post("/editedCoupon",verifyAdmin,couponController.submitEditCoupon);
adminRoute.post("/deleteCoupon",verifyAdmin,couponController.deleteCoupon)

// Sales report
adminRoute.get("/salesManagement",verifyAdmin,orderController.getSales);
adminRoute.get("/adminDashboard",verifyAdmin,adminController.getAdminDashboard);


// upload image area
adminRoute.post("/addProduct",upload.array("proImage",4),verifyAdmin,productController.addProduct);
adminRoute.post("/editProduct",upload.array("editproImage",4),verifyAdmin,productController.applyEditProduct);
adminRoute.post('/submitBanner',upload.single("BannerImage"),verifyAdmin,bannerController.applyBanner);
adminRoute.post("/applyEditBanner",upload.single("editBannerImage"),verifyAdmin,bannerController.applyEditBanner);




module.exports = adminRoute;