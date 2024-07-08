const Users = require("../model/users");
const Colleges = require("../model/college");

function getData(req, res) {
  Users.find()
    .populate("collegeId")
    .then((data) => {
      res.render("viewUsers", {
        title: "View",
        path: "/",
        data,
      });
    });
}

function getForm(req, res) {
  res.render("createUser", {
    title: "Create",
    path: "/add-user",
  });
}

function addData(req, res) {
  const collegeList = {
    MGIT: "668a3f689ab1cc602db25272",
    CBIT: "668a3f689ab1cc602db25273",
    JNTU: "668a3f689ab1cc602db25274",
    OU: "668a3f689ab1cc602db25275",
  };
  const { college, ...rest } = req.body;
  const data = { ...rest, collegeId: collegeList[college] };
  const users = new Users(data);
  users
    .save()
    .then((result) => {
      result.addToCollegeDB(result._id, result.collegeId);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
}

function editForm(req, res) {
  const id = req.query._id;
  Users.findById(id)
    .then((user) => {
      res.render("editUser", {
        title: "Edit",
        path: "",
        data: user,
      });
    })
    .catch((err) => console.log(err));
}

function editData(req, res) {
  const id = req.body._id;
  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;
  const phone = req.body.phone;
  Users.findById(id)
    .then((user) => {
      user.name = name;
      user.age = age;
      user.email = email;
      user.phone = phone;
      return user.save();
    })
    .then((result) => {
      console.log("Updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
}

function deleteData(req, res) {
  const id = req.query._id;
  Users.findByIdAndDelete(id)
    .then((result) => {
      console.log("Deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
}

function getDataById(req, res) {
  const id = req.params.id;
  Users.findById(id)
    .select("name age -_id")
    .populate("collegeId", "name -_id")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
}

function getstudentsData(req, res) {
  Colleges.findById("668a3f689ab1cc602db25273")
    .populate("students")
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

module.exports = {
  getData,
  getForm,
  addData,
  editForm,
  editData,
  deleteData,
  getDataById,
  getstudentsData,
};
