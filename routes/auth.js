const express = require("express");
const authController = require("../controller/auth");

const userRouter = express.Router();

userRouter.get("/login", authController.getLogin);
userRouter.post("/login", authController.postLogin);
userRouter.get("/signup", authController.getSignup);
userRouter.post("/signup", authController.postSignup);
userRouter.post("/logout", authController.postLogout);

module.exports = userRouter;
