let Schema = require('../models/adminModel')
let bcrypt = require('bcrypt')
let userModel = require('../models/userModel')
let id = ''

const loadModel = async()=>{
    try{
        let user = await userModel.find()
        return user
    }catch{
        return {message:"Internal error"}
    }
}
const loginLoad = async(username,password)=>{
    let user = await userModel.find()
    if(username=='admin'&&password =='admin'){
        return {success:true,user:user,message:""}
    }else{
        return{success:false,message:"Invalid crendential"}
    }
}


const deleteUser = async (id)=>{
    await userModel.deleteOne({_id:id})

}

const addUser = async(username,password,email)=>{
    let user = await userModel.findOne({email})
    if(user){
        let use = await userModel.find()
        return {success:false}
    }
    let hash = await bcrypt.hash(password,10)
    let use =  await userModel.find()
    use  = new userModel({
            username:username,
            email:email,
            password:hash
        })
    await use.save()
    return {success:true}
}
module.exports = {loginLoad,loadModel,deleteUser,addUser}