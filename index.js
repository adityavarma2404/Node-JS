const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const Colleges = require("./model/college");
// const { findCollegeById } = require("./model/college");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

// app.use((req, res, next) => {
//   findCollegeById("6689211dcb05fa60c4349553")
//     .then((college) => {
//       req.college = college;
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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

// mongoConnect(() => app.listen(PORT));
