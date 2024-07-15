const express = require("express");
const userController = require("../controller/view");
const isAuth = require("../middleware/isAuth");

const userRouter = express.Router();

userRouter.get("/", isAuth, userController.getData);
userRouter.get("/add-user", isAuth, userController.getForm);
userRouter.post("/add-user", isAuth, userController.addData);
userRouter.get("/edit", isAuth, userController.editForm);
userRouter.post("/edit", isAuth, userController.editData);
userRouter.post("/delete", isAuth, userController.deleteData);
userRouter.get("/students", isAuth, userController.getstudentsData);
userRouter.get("/:id", isAuth, userController.getDataById);

module.exports = userRouter;
