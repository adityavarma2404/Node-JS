const User = require("../models/users");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}
async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "user not found" });
  return res.json(user);
}
async function handleUpdateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
  return res.json({ msg: "Updated" });
}
async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ msg: "Deleted" });
}
async function handleCreateNewUser(req, res) {
  try {
    const body = req.body;
    if (
      !body ||
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.gender
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const result = await User.create({
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      gender: body.gender,
    });
    console.log(result);

    return res.status(201).json({ msg: "Success", id: result._id });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).send({ error: "Email must be unique" });
    } else {
      res.status(500).send({ error: "An error occurred" });
    }
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
