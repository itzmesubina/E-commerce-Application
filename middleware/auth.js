const verifyAdmin= (req,res,next)=>{
    if(req.session.adminId){
        next()
    }else{
        res.redirect("/admin")
    }
}

const verifyUser = (req,res,next)=>{
    if(req.session.user){
        req.login = true
        res.locals.login = true
        next()
    }else{
        res.redirect("/signin")
    }
};
module.exports = {
    verifyAdmin,
    verifyUser
}