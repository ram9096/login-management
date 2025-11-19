let express  = require('express')
let app = express.Router()
let admincontroller = require('../controller/adminController')
let session = require('express-session')



app.get('/',admincontroller.loginLoad)
app.post('/',admincontroller.verifyLogin)
app.get('/home',admincontroller.isAuth,admincontroller.home)
app.get('/adminEdit/:id',admincontroller.isAuth,admincontroller.editUser)
app.post('/userEdit',admincontroller.userEdit)
app.get('/adminDelete/:id',admincontroller.adminDelete)
app.post('/addUser',admincontroller.isAuth,admincontroller.addUser)
app.get('/logout',admincontroller.isAuth,admincontroller.logout)

module.exports = app