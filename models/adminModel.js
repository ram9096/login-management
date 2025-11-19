let mongoose = require('mongoose')

let schema = mongoose.Schema

let adminSchema = new schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


module.exports = mongoose.model('admins',adminSchema)