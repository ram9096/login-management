let mongoose = require('mongoose')
let schema = mongoose.Schema

const userSchema = new schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    }
})

module.exports = mongoose.model('user',userSchema)