const userModel = require('../models/userModel')
let bcrypt = require('bcrypt')
const userServise  = require('../service/userService')
const loginPage = (req,res)=>{
    res.redirect('/login')
}

const loginRender = (req,res)=>{
    if(req.session.isAdmin){
        return res.redirect('/admin')
    }
    if(req.session.isAuth){
        
        return res.redirect('/home')
    }
    res.render('userLogin',{message:''}) 
}
const loginPost = async (req,res)=>{
    const {username,password} = req.body
    try{
        const result = await userServise.userVerify(username,password)
        if(!result.success){
            return res.status(401).render('userLogin',{message:result.message})
        }
        req.session.userName = username
        req.session.isAuth = true
        res.redirect('/home')
    }catch{
        res.status(500).send("Internal error")
    }
}

const register = (req,res)=>{
    if(req.session.isAuth){
        return res.redirect('/home')
    }
    res.render('register',{message:''})
}

const registerPost = async (req,res)=>{
    try {
        const {userName,passWord,email} = req.body
        const result = await userServise.userRegister(userName,passWord,email)
        if(!result.success){
            return res.status(409).render('register',{message:result.message})
        }

        req.session.userName = userName
        req.session.isAuth = true
        res.redirect('/home')

    }catch(err){
        res.status(500).render('userLogin',{message:'Server error'})

    }
}

const home = (req,res)=>{
    if(req.session.isAuth){
        res.render('userHomepage',{message:''})
    }else{
        res.render('userLogin')
    }
}

const logout = (req,res)=>{
  
    req.session.destroy(err => {
    if (err) {
      
      res.clearCookie('connect.sid');
      return res.redirect('/home');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login'); 
  });
   
}

module.exports = {loginPage,loginRender,loginPost,registerPost,register,home,logout}