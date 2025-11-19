const userModel = require('../models/userModel')
let bcrypt = require('bcrypt')


const userVerify = async (username,password)=>{
    const user = await userModel.findOne({username})
    if(!user){
        return { success: false, message: "Username Doesn't match" }
        
    }
    let passMatch = await bcrypt.compare(password,user.password)
    if(!passMatch){
        return { success: false, message: "Password Doesn't match" }
    }
    return {success:true,user}
}

const userRegister = async (userName,passWord,email)=>{
    let user = await userModel.findOne({email})
    if(user){
        return  { success: false, message: "User already exists" }
    }
    let hash = await bcrypt.hash(passWord,10)
    user  = new userModel({
        username:userName,
        email:email,
        password:hash
    })
    await user.save()
    return { success: true, user: user };

   
}
module.exports = {userVerify,userRegister}