const mongodb = require("mongodb");
const {
  readFileFromDB,
  createDataToDB,
  deleteDataInDB,
  updateDataToDB,
  getDataByIdFromDB,
  getstudentsDataFromDB,
} = require("../model/users");

const ObjectID = mongodb.ObjectId;

function getData(req, res) {
  readFileFromDB((users) => {
    res.render("viewUsers", {
      title: "View",
      data: users,
      path: "/",
    });
  });
}

function getDataById(req, res) {
  const id = req.params.id;
  getDataByIdFromDB((user) => {
    res.send(user);
  }, id);
}

function getForm(req, res) {
  res.render("createUser", {
    title: "Create",
    path: "/add-user",
  });
}

function editForm(req, res) {
  const id = req.query._id;
  getDataByIdFromDB((user) => {
    res.render("editUser", {
      title: "Edit",
      path: "",
      data: user,
    });
  }, id);
}

function editData(req, res) {
  updateDataToDB(req.body);
  res.redirect("/");
}

function addData(req, res) {
  const collegeList = {
    MGIT: "6689211dcb05fa60c4349553",
    CBIT: "668947c0cb05fa60c4349557",
    JNTU: "668947d6cb05fa60c4349559",
    OU: "668947eccb05fa60c434955b",
  };
  const { college, ...rest } = req.body;
  const data = { ...rest, collegeId: new ObjectID(collegeList[college]) };
  createDataToDB(data);
  res.redirect("/");
}

function getstudentsData(req, res) {
  getstudentsDataFromDB((data) => {
    res.render("viewStudents", {
      title: "Students",
      path: "/students",
      data: data,
    });
  });
}

function deleteData(req, res) {
  const id = req.query._id;
  deleteDataInDB(id);
  res.redirect("/");
}

module.exports = {
  getData,
  addData,
  getForm,
  deleteData,
  editForm,
  editData,
  getDataById,
  getstudentsData,
};
