const Users = require("../model/users");

function getData(req, res) {
  Users.find().then((data) => {
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
    .then((result) => res.redirect("/"))
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
  console.log(req.body);
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
    .then((result) => res.send(result))
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
};

// const mongodb = require("mongodb");
// const {
//   readFileFromDB,
//   createDataToDB,
//   deleteDataInDB,
//   updateDataToDB,
//   getDataByIdFromDB,
//   getstudentsDataFromDB,
// } = require("../model/users");

// const ObjectID = mongodb.ObjectId;

// function getData(req, res) {
//   readFileFromDB((users) => {
//     res.render("viewUsers", {
//       title: "View",
//       data: users,
//       path: "/",
//     });
//   });
// }

// function getDataById(req, res) {
//   const id = req.params.id;
//   getDataByIdFromDB((user) => {
//     res.send(user);
//   }, id);
// }

// function getForm(req, res) {
//   res.render("createUser", {
//     title: "Create",
//     path: "/add-user",
//   });
// }

// function editForm(req, res) {
//   const id = req.query._id;
//   getDataByIdFromDB((user) => {
//     res.render("editUser", {
//       title: "Edit",
//       path: "",
//       data: user,
//     });
//   }, id);
// }

// function editData(req, res) {
//   updateDataToDB(req.body);
//   res.redirect("/");
// }

// function addData(req, res) {
//   const collegeList = {
//     MGIT: "6689211dcb05fa60c4349553",
//     CBIT: "668947c0cb05fa60c4349557",
//     JNTU: "668947d6cb05fa60c4349559",
//     OU: "668947eccb05fa60c434955b",
//   };
//   const { college, ...rest } = req.body;
//   const data = { ...rest, collegeId: new ObjectID(collegeList[college]) };
//   createDataToDB(data);
//   res.redirect("/");
// }

// function getstudentsData(req, res) {
//   getstudentsDataFromDB((data) => {
//     res.render("viewStudents", {
//       title: "Students",
//       path: "/students",
//       data: data,
//     });
//   });
// }

// function deleteData(req, res) {
//   const id = req.query._id;
//   deleteDataInDB(id);
//   res.redirect("/");
// }

// module.exports = {
//   getData,
//   addData,
//   getForm,
//   deleteData,
//   editForm,
//   editData,
//   getDataById,
//   getstudentsData,
// };
