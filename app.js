 const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const session=require("express-session")

const adminRoute = require("./routers/adminRoute");
const userRoute = require("./routers/userRoute");
const errorcontroller = require('./controllers/errorcontroller');

require('dotenv').config()
const db =  require('./config/config')
 
db.dbConnect(cb=>{
    if(cb){
        console.log('db running..');
        return
    }
    console.log('error connection db')
})

// configuring user  route
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.join(__dirname,"views"))
app.set("view engine","ejs");

app.use(express.json())

// cache clearing
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, mustx-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');  
    next(); 
});

app.use(session({
    secret:"Secret Key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
    }));



app.use("/admin",adminRoute);
app.use("/",userRoute);
app.use(errorcontroller.get404);

app.listen(process.env.PORT||4000,()=>console.log("server is running in Port 3000..."))