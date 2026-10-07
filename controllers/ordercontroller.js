const User = require("../models/userModel");
const productModel = require("../models/productModel");
const Order = require("../models/orderModel")



//!! html to pdf generate required thing
const ejs = require('ejs')
const pdf = require('html-pdf') 
const fs = require('fs')
const path =require('path')


// !!!Order Management
const getOrderManagement = async(req,res)=>{
    try {
      const OrderData = await Order.find({}).populate("products.product")
      const OrderCount = await Order.find({}).populate("products.product").count()
      console.log(OrderCount);
      res.render("admin/ordermanagement",{OrderData,OrderCount})
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!! Change Order Status
const postStatusChanges = async(req,res)=>{
    try {
      console.log("change Order Status");
      const orderId = req.body.orderId;
      const statusData = req.body.orderStatus;
      const orderDatas = await Order.updateOne({_id:orderId},{$set:{ orderStatus:"Delivered",paymentStatus:"Paid"}}).then((data)=>{
        res.send({success:true})
      })
  
    } catch (error) {
      console.log(error);
    }
  }
  // ! Get admin Sales
const getSales = async(req,res)=>{
    try {
    if(req.session.adminId){
      const userCount = await User.find().count()
      const productCount = await productModel.find().count()
      const salesCount = await Order.find({orderStatus:"Delivered"}).count()
      const totalIncome = await Order.aggregate([
        {$match:{
          orderStatus:"Delivered"
        }},
        {
          $group:{
            _id:null,
            totalPrice:{$sum:'$Subtotal'}
        }
      },{$project: { _id: 0 } }
    ]);

      const data = totalIncome;
      let totalPrice;

      if (data.length > 0) {
        totalPrice = data[0].totalPrice;
      } else {
        totalPrice = 0;
      }

      const orderUsers =await Order.find({orderStatus:"Delivered"})
        res.render("admin/sales",
        {userCount,
        productCount,
        salesCount,
        totalPrice,
        orderUsers
      })
    }else{
      res.redirect("/admin")
    }
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!Pdf download codes 
const downSalesReport = async(req,res)=>{
    try {
      let orderData;
      const fromDate = req.body.dateFrom;
      const toDate = req.body.dateTo;
      if(fromDate==""&&toDate==""){
        orderData = await Order.find({orderStatus:"Delivered"}).populate("products.product")
      }else if(fromDate==""){
        res.redirect("/admin/salesManagement")
      }else if(toDate==""){
        res.redirect("/admin/salesManagement")
      }else{  
        orderData = await Order.find({$and:[{date:{$gte:fromDate}},{date:{$lte:toDate}},{orderStatus:"Delivered"}]}).populate("products.product")
      }
  
  
      const data={
        order:orderData,
        fromDate:fromDate,
        toDate:toDate
      }
      const filePathName = path.resolve(__dirname,'../views/admin/salesreport.ejs')
      const htmlString =  fs.readFileSync(filePathName).toString();
      let option = {
        phantomPath: './node_modules/phantomjs-prebuilt/bin/phantomjs',
        format:'A4',
        border:'10mm'
      }
     const ejsData =  ejs.render(htmlString,data);
     pdf.create(ejsData,option).toFile('Sales_Report.pdf',(err,response)=>{
      if(err)console.log(err);
      const filePath = path.resolve(__dirname,"../Sales_Report.pdf");
      console.log('sales report generated');
      fs.readFile(filePath,(err,file)=>{
        if(err){
          console.log(err);
          return res.status(500).send('Could Not download File')
        }
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition','attach;filename="Sales_Report.pdf"');
        res.send(file)
      })
  
     })
  
    } catch (error) {
      console.log(error);
    }
  }
  
  
module.exports = {
    getOrderManagement,
    postStatusChanges,
    getSales,
    downSalesReport
}