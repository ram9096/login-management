let Schema = require('../models/adminModel')
let bcrypt = require('bcrypt')
let userModel = require('../models/userModel')
//let id = ''
let adminService = require('../service/adminService')



const isAuth = (req,res,next)=>{
    if(req.session.isAdmin){
        return next()
    }else{
        res.redirect('/admin')
    }
}

const isAdmin = (req,res,next)=>{
    if(req.session.role == 'admin'){
        next()
    }else{
        res.status(403).send("Forbidden access")
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
        req.session.role = 'admin'
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

        console.log(user)
    
        res.render('adminHomepage',{user:user,adderror:''})

    }catch{
        res.status(500).send("Internal error")
    }
}

const preventCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
};

const editUser = async(req,res)=>{
    if(!req.session.isAdmin){
        return res.redirect('/')
    }
    req.session.editUser = req.params.id;

    let user = await userModel.findById(req.params.id);

    res.render('adminEdit',{ user });
}

const userEdit = async (req,res)=>{
    if(!req.session.isAdmin){
        return res.redirect('/')
    }

    let { username, email } = req.body;
    let id = req.session.editUser;

    let user = await userModel.findById(id);
    if (!user) return res.send("404");

    await userModel.findByIdAndUpdate(id, { username, email });

    res.redirect('/admin');
};

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
module.exports = {loginLoad,verifyLogin,home,editUser,userEdit,adminDelete,isAuth,addUser,logout,isUserId,preventCache,isAdmin}