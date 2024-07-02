const express = require("express");
const {connectMongoDB} = require("./connection");
const userRouter = require('./routes/users');
const staticRouter = require('./routes/staticRouter');
const authUserRoute = require('./routes/authUsers');
const {logReqRes} = require("./middlewares") //if inside there is index file, then no need to mention for that file
const path = require("path");
const cookieParser = require('cookie-parser');
const {restrictToLoggedInUserOnly, checkAuthenticated,checkForAuthentication, restrictTo} = require('./middlewares/auth')

const app = express();
const PORT = 8000;

//connects to mongoDB
connectMongoDB("mongodb://127.0.0.1:27017/practice1").then(() => console.log("MongoDB connected"))

//middleware
app.use(express.urlencoded({ extended: false })); // to parse form data
app.use(express.json());// to parse JSON data
app.use(logReqRes("log.txt"));
app.use(cookieParser());
app.use(checkForAuthentication); // to alwasy authenticate for every request

//ejs
app.set("view engine","ejs");// setting up a view engine
app.set("views", path.resolve("./views")); // letting express know that in this path you can find .ejs files

//routes
//restrictToLoggedInUserOnly will restrict to access /user until user has logged in
// app.use("/user", restrictToLoggedInUserOnly,userRouter);
// app.use("/ssr",checkAuthenticated ,staticRouter);
// app.use("/auth", authUserRoute);
app.use("/user",restrictTo(["admin"]),userRouter);
app.use("/ssr",staticRouter);
app.use("/auth", authUserRoute);

//SSR
// after successful login, it will render a home page, there if you submit form, it will redirect to /yourName page
app.get('/yourName', (req,res) =>{
    return res.render('yourName', {name:req.query.name});
})

app.listen(PORT, () => console.log("Listening"));
