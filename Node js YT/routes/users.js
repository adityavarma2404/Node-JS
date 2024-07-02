const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser
} = require("../controllers/user");

const router = express.Router();

//parent path is /user. 
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

// if id given to path then perform get,delete,patch. /user/id
router
  .route("/:id")
  .get(handleGetUserById)
  .delete(handleDeleteUserById)
  .patch(handleUpdateUserById);

module.exports = router


// router
//   .route("/api/users/:id")
//   .get(async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ msg: "user not found" });
//     return res.json(user);
//   })
//   .delete(async (req, res) => {
//     await User.findByIdAndDelete(req.params.id);
//     return res.json({ msg: "Deleted" });
//   })
//   .patch(async (req, res) => {
//     await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
//     return res.json({ msg: "Updated" });
//   });

// router
//   .route("/api/users")
//   .get(async (req, res) => {
//     const users = await User.find({});
//     return res.json(users);
//   })
//   .post(async (req, res) => {
//     const body = req.body;
//     if (
//       !body ||
//       !body.first_name ||
//       !body.last_name ||
//       !body.email ||
//       !body.gender
//     ) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }
//     const result = await User.create({
//       firstName: body.first_name,
//       lastName: body.last_name,
//       email: body.email,
//       gender: body.gender,
//     });
//     console.log(result);

//     return res.status(201).json({ msg: "Success" });
//   });
