const express = require("express");
const { check, body } = require("express-validator");
const userController = require("../controller/view");
const isAuth = require("../middleware/isAuth");
const Users = require("../model/users");

const userRouter = express.Router();

userRouter.get("/", isAuth, userController.getData);
userRouter.get("/add-user", isAuth, userController.getForm);
userRouter.post(
  "/add-user",
  isAuth,
  [
    check("name", "Enter min 3 character name").isLength({ min: 3 }).trim(),
    check("age")
      .isInt({ min: 18, max: 25 })
      .withMessage("Please enter age between 18 and 25"),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return Users.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
          return true;
        });
      })
      .normalizeEmail(),
    check("phone").custom((value, { req }) => {
      if (value.length !== 10) {
        return Promise.reject("Phone number must be 10 digits");
      }
      return true;
    }),
    check("college").custom((value, { req }) => {
      if (value === "") {
        return Promise.reject("Please select a college");
      }
      return true;
    }),
  ],
  userController.addData
);
userRouter.get("/edit", isAuth, userController.editForm);
userRouter.post("/edit", isAuth, userController.editData);
userRouter.post("/delete", isAuth, userController.deleteData);
userRouter.get("/students", isAuth, userController.getstudentsData);
userRouter.get("/:id", isAuth, userController.getDataById);

module.exports = userRouter;
