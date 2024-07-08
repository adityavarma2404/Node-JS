const express = require("express");
const {
  getData,
  addData,
  getForm,
  editForm,
  editData,
  deleteData,
  getDataById,
  // getstudentsData,
} = require("../controller/view");

const userRouter = express.Router();

userRouter.get("/", getData);
userRouter.get("/add-user", getForm);
userRouter.post("/add-user", addData);
userRouter.get("/edit", editForm);
userRouter.post("/edit", editData);
userRouter.get("/delete", deleteData);
// userRouter.get("/students", getstudentsData);
userRouter.get("/:id", getDataById);

module.exports = userRouter;
