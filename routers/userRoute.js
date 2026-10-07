const express = require("express");
const userRoute = express();
const session=require("express-session");
const {check} = require("express-validator");


const {verifyUser} = require("../middleware/auth")
const config=require("../config/config");
const userController = require("../controllers/userController");


userRoute.use(express.json());
userRoute.use(express.urlencoded({extended:true}))

// Route get methods
userRoute.get("/", userController.loadHome);
userRoute.get("/signin",userController.userLogin)
userRoute.get("/signup",userController.userSignup);
userRoute.get("/otp",userController.getOtp);
userRoute.get("/singleproduct", userController.getSingleProduct);
userRoute.get("/cartmanagement",verifyUser,userController.getUserCart);
userRoute.get("/account",verifyUser,userController.getAccount);
userRoute.post("/changeProfile",verifyUser,userController.changeProfile);
userRoute.get("/allProducts",userController.getAllProducts);
userRoute.get("/userAddress",verifyUser,userController.getUserAddress);
// todo:product search
userRoute.post("/search",userController.searchProduct);

// todo: Wishlist
userRoute.get("/wishlist",verifyUser,userController.getWishlist);
userRoute.get("/addToWishlist",verifyUser,userController.getAddToWishlist);
userRoute.post("/removeWishlistItem",verifyUser,userController.removeWishItem);
// todo:Add to cart

userRoute.get("/addToCart",verifyUser,userController.getAddToCart);
userRoute.post("/change-product-quantity",verifyUser,userController.changeQuantity);
userRoute.post("/removeCartItem",verifyUser,userController.removeCartItems);
userRoute.post("/ifWish",verifyUser,userController.ifWish);

// Route post methods
userRoute.post("/signin",[check('email').isEmail().withMessage("please enter the valid Email")],userController.verifyLogin);
userRoute.post("/checkOtp",verifyUser,userController.checkOtp); 
userRoute.post("/signup",userController.insertUser);
userRoute.post("/signin",userController.loadSgnup);

// todo: Profile side
userRoute.post("/addAddress",verifyUser,userController.addAddress);
userRoute.post("/deleteAddress",verifyUser,userController.deleteAddress);

// todo:Checkout page
userRoute.get("/checkOut",verifyUser,userController.getCheckOut);
userRoute.post("/applyCoupon",verifyUser,userController.applyCoupon);
userRoute.post("/selectAddress",verifyUser,userController.selectShippingAddress);
userRoute.post("/verifyPayment",verifyUser,userController.verifyPayment)
userRoute.post("/submitCheckOut",verifyUser,userController.submitCheckout);
userRoute.get("/success",verifyUser,userController.getSuccess);
userRoute.get("/orderProductDetails",verifyUser,userController.getOrderDetails);
// todo:  the order history  page
userRoute.get("/orderHistory",verifyUser,userController.getOrderHistory);
userRoute.get("/orderedProductDetails",verifyUser,verifyUser,userController.getOrderProductDetails)
userRoute.post("/cancelOrder",verifyUser,userController.userCancelOrder)
userRoute.post("/returnOrder",verifyUser,userController.returnOrder)

// todo:User Logout

userRoute.get("/userLogout",verifyUser,userController.userLogout);

module.exports = userRoute;