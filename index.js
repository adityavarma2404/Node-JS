const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const userRouter = require("./routes/user");
const Colleges = require("./model/college");
const Users = require("./model/users");

const app = express();
const PORT = 7090;

//for destination folder and file name.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
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
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  Users.findById("668e7a322ceb1116c78ffe2c")
    .then((result) => {
      req.profilePic = result.imageURL;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(
  multer({ storage: multer.memoryStorage(), fileFilter: fileFilter }).single(
    "image"
  )
);

app.use("/", userRouter);

mongoose
  .connect(
    "mongodb+srv://aditya:aditya123@cluster0.qec8fak.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0"
  )
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
