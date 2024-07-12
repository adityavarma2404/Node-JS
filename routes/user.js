const express = require("express");
const userController = require("../controller/view");
const authController = require("../controller/auth");

const userRouter = express.Router();

userRouter.get("/", userController.getData);
userRouter.get("/add-user", userController.getForm);
userRouter.post("/add-user", userController.addData);
userRouter.get("/edit", userController.editForm);
userRouter.post("/edit", userController.editData);
userRouter.post("/delete", userController.deleteData);
userRouter.get("/students", userController.getstudentsData);
userRouter.get("/login", authController.getLogin);
userRouter.post("/login", authController.postLogin);
userRouter.post("/logout", authController.postLogout);
userRouter.get("/:id", userController.getDataById);

module.exports = userRouter;
