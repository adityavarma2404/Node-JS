const express = require("express");
const controller = require("../controller/view");

const userRouter = express.Router();

userRouter.get("/", controller.getData);
userRouter.get("/add-user", controller.getForm);
userRouter.post("/add-user", controller.addData);
userRouter.get("/edit", controller.editForm);
userRouter.post("/edit", controller.editData);
userRouter.post("/delete", controller.deleteData);
userRouter.get("/students", controller.getstudentsData);
userRouter.get("/login", controller.getLogin);
userRouter.post("/login", controller.postLogin);
userRouter.post("/logout", controller.postLogout);
userRouter.get("/:id", controller.getDataById);

module.exports = userRouter;
