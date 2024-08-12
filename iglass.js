const express = require("express")                             // import  module
const path = require("path") 

const session = require("express-session")
const SessionStore = require("connect-mongodb-session")(session)
const flash = require("connect-flash")

const homeRouter = require("./routes/home.route")                 // import route
const authRouter = require("./routes/auth.route")     
const contactusRouter = require("./routes/contactus.route")       
const aboutusRouter = require("./routes/aboutus.route")       
const virtualTryOnRouter = require("./routes/virtualTryOn.route")       
const welcomeRouter = require("./routes/welcome.route")       
const faceDetectionRouter = require("./routes/faceDetection.route")       
const checkoutRouter = require("./routes/checkout.route")       
const adminRouter = require("./routes/admin.route")  
const cartRouter = require("./routes/cart.route")  
const orderRouter = require("./routes/order.route")  
const favRouter = require("./routes/fav.route") 

const app = express()                                                          

app.use(express.static(path.join(__dirname, 'images')))                                       
app.use(express.static(path.join(__dirname, 'assets')))
app.use(flash())
app.use(express.json())
const STORE = new SessionStore({                                                    // store session
  uri: 'mongodb://localhost:27017/iglass',
  collection: 'sessions'})

app.use(session({                                                                 // use session
  secret: 'this is my secrt to hash express session', 
  saveUninitialized: false,       
  store: STORE
  }
))

app.set('viewer engine', 'ejs' )                                                  // set ejs
app.set('views','views')  


app.get('/', (req, res,next) => {                                                  // get route
res.render('welcome.ejs')
})

app.use('/',homeRouter)                                  // use home route
app.use('/', authRouter) 

app.use('/', contactusRouter) 
app.use('/', aboutusRouter) 
app.use('/', virtualTryOnRouter)
app.use('/', welcomeRouter)
app.use('/', faceDetectionRouter)
app.use('/', checkoutRouter)
app.use('/', aboutusRouter)
app.use('/', adminRouter)
app.use('/', cartRouter)
app.use('/', orderRouter)
app.use('/', favRouter)

app.listen(3000, (err) => {
  console.log(err);
  console.log("server is running on port 3000");
})