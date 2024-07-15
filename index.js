const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const lusca = require("lusca");
const flash = require("connect-flash");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const Colleges = require("./model/college");
const errorController = require("./controller/error");
// const Users = require("./model/users");

const app = express();
const PORT = 5000;
const MONGODB_URI =
  "mongodb+srv://aditya:aditya123@cluster0.qec8fak.mongodb.net/users";
// "mongodb+srv://aditya:aditya123@cluster0.qec8fak.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(
  multer({ storage: multer.memoryStorage(), fileFilter: fileFilter }).single(
    "image"
  )
);

//for CSRF tokens
app.use(lusca.csrf());

//for flashing error messages
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.profilePic) {
    return next();
  }
  req.profilePic = req.session.profilePic;
  next();
});

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/favicon.ico", (req, res) => res.status(204).send());

app.get("/500", errorController.get500);
app.use("/", userRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  console.log("Inside 500 middleware");
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    Colleges.findOne().then((data) => {
      if (!data) {
        const colleges = new Colleges({
          name: "MGIT",
          location: "Hyderabad",
          students: [],
        });
        colleges.save();
      }
    });
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
