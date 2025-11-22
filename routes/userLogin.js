let express  = require('express')
let app = express.Router()
const userModel = require('../models/userModel')
let nocache = require('nocache')
let bcrypt = require('bcrypt')
const userController = require('../controller/userController')


app.get('/',userController.loginPage)

const isAuth = async (req,res,next)=>{
    if(!req.session.isAdmin){
        if(!req.session.isAuth){
            return res.redirect('/')
        }
    }
    if(req.session.isAdmin){
        return res.redirect('/admin')
    }

    const user = await userModel.findOne({username: req.session.userName});
        if (!user) {
            req.session.destroy(err => {
                if (err) console.log(err);
                res.clearCookie('connect.sid');
                return res.redirect('/login');
            });
        } else {
            next();
        }
    
}

app.get('/login',userController.loginRender)
app.post('/login',userController.loginPost)
app.get('/register',userController.register)
app.post('/register',userController.registerPost)
app.get('/home',isAuth,userController.home)
app.get('/logout',userController.logout)


module.exports = app   