let Schema = require('../models/adminModel')
let bcrypt = require('bcrypt')
let userModel = require('../models/userModel')
let id = ''
let adminService = require('../service/adminService')



const isAuth = (req,res,next)=>{
    if(req.session.isAdmin){
        return next()
    }else{
        res.redirect('/admin')
    }
}
const isUserId = (req,res,next)=>{
    req.session.userId = req.params.id
    if(!req.session.userId){
        return res.redirect('/admin')
    }
    next()
}
const loginLoad = async (req,res)=>{
    try{
        if(req.session.isAdmin){
            let user = await adminService.loadModel()
            return res.render('adminHomepage',{user:user,adderror:''})
        }
        res.render('adminLogin',{message:''})
    }catch{
        res.status(500).send("Internal error")
    }
}

const verifyLogin = async (req,res)=>{
    let {username,password} = req.body
    
    try{
        const user = await adminService.loginLoad(username,password)
        if(!user.success){
            return res.status(401).render("adminLogin",{message: user.message})
        }
        req.session.isAdmin = true
        res.redirect('/admin')
    }catch{
        res.status(500).send('Internal error')
    }
}
const home = async (req,res)=>{

    try{
        const admin = req.session.isAdmin
        if(!admin){
            return res.render('adminLogin',{message:""})
        }

        const user = await adminService.loadModel()
    
        res.render('adminHomepage',{user:user,adderror:''})

    }catch{
        res.status(500).send("Internal error")
    }
}

const editUser = async(req,res)=>{
    try{
        if(!req.session.isAdmin){
            return res.redirect('/')
        }
        let user = await userModel.findById(req.params.id)
        req.session.userId = req.params.id
        //console.log(req.session.userId)
        res.render('adminEdit',{id:user})
    }catch{
        res.status(500)
    }
    
}
const userEdit = async (req,res)=>{
    try{
        if(!req.session.isAdmin){
            return res.redirect('/')
        }
        let {username,email} = req.body
        console.log(req.session.userId)
        let user = await adminService.editUser(username,email,id)

        if(!user.success){
            return res.status(400).redirect('/admin')
        }
        req.session.userId = false
        res.redirect('/admin')

    }catch{
        res.status(500)
    }
}
const adminDelete = async (req,res)=>{
    try{
        if(!req.session.isAdmin){
            return res.redirect('/')
        }
        await adminService.deleteUser(req.params.id)


        res.redirect('/admin')
    }catch{
        res.status(500)
    }
}

const addUser = async(req,res)=>{
    try{
        const {username,password,email} = req.body
        let user = await adminService.addUser(username,password,email)
        if(!user.success){
            let data = await adminService.loadModel()
            return res.status(401).render('adminHomepage',{adderror:'User already exist',user:data})
        }
        res.redirect('/admin')
    }catch{
        res.status(500)
    }
}
const logout = (req,res)=>{
    req.session.destroy(err => {
    if (err) {
      
      res.clearCookie('connect.sid');
      return res.redirect('/admin/home');
    }
    res.clearCookie('connect.sid');
    res.redirect('/admin'); 
  });
}
module.exports = {loginLoad,verifyLogin,home,editUser,userEdit,adminDelete,isAuth,addUser,logout,isUserId}