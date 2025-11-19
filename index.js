let express  = require('express')
let app = express()
let nocache = require('nocache')
let userLogin = require('./routes/userLogin')
let admin = require('./routes/adminRouter')
let session = require('express-session')



app.use(express.static("public"))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))


const morgan = require('morgan');
app.use(morgan('dev'));
//Mongoose Connection set-up
let mongoDbStore = require('connect-mongodb-session')(session)

let mongoose = require('mongoose')

let mongoUri = "mongodb://localhost:27017/"
mongoose.connect(mongoUri)
    .then(()=>{
        console.log("Mongoose Connected")
    })
let store = new mongoDbStore({
    uri:mongoUri,
    collection:'mySession'
})

// Session setup
app.use(nocache())

app.use(session({
    secret:"Key",
    resave:false,
    saveUninitialized:false,
    store:store
}))



app.use('/',userLogin)
app.use('/admin',admin)
app.use('/',(req,res)=>{
    res.send("404")
})

app.listen(5000,()=>{
    console.log("Server is running")
})