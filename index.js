const path = require("path");
const express = require("express");
const userRouter = require("./routes/user");
const mongoConnect = require("./utils/database").mongoConnect;
const { findCollegeById } = require("./model/college");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  findCollegeById("6689211dcb05fa60c4349553")
    .then((college) => {
      req.college = college;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);

mongoConnect(() => app.listen(PORT));
