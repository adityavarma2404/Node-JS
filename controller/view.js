const Users = require("../model/users");
const Colleges = require("../model/college");

exports.getData = (req, res) => {
  Users.find().then((data) => {
    res.render("viewUsers", {
      title: "View",
      path: "/",
      // profilePic: `data:${
      //   req.profilePic.contentType
      // };base64,${req.profilePic.data.toString("base64")}`,
      data,
    });
  });
};

exports.getForm = (req, res) => {
  res.render("createUser", {
    title: "Create",
    path: "/add-user",
    // profilePic: `data:${
    //   req.profilePic.contentType
    // };base64,${req.profilePic.data.toString("base64")}`,
  });
};

exports.addData = (req, res) => {
  const collegeList = {
    MGIT: "668a3f689ab1cc602db25272",
    CBIT: "668a3f689ab1cc602db25273",
    JNTU: "668a3f689ab1cc602db25274",
    OU: "668a3f689ab1cc602db25275",
  };
  const imageFile = req.file;
  if (!imageFile) {
    return res.render("error", {
      title: "Error",
      path: "",
      message: "No image provided",
      // profilePic: `data:${
      //   req.profilePic.contentType
      // };base64,${req.profilePic.data.toString("base64")}`,
    });
  }

  const imageURL = {
    data: Buffer.from(imageFile.buffer, "base64"),
    contentType: imageFile.mimetype,
  };
  const { college, ...rest } = req.body;
  const data = { ...rest, collegeId: collegeList[college], imageURL };
  const users = new Users(data);
  users
    .save()
    .then((resultOne) => {
      Colleges.findById(resultOne.collegeId)
        .then((resultTwo) => {
          return resultTwo.addStudentId(resultOne._id);
        })
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.editForm = (req, res) => {
  const id = req.query._id;
  Users.findById(id)
    .then((user) => {
      res.render("editUser", {
        title: "Edit",
        path: "",
        data: user,
        // profilePic: `data:${
        //   req.profilePic.contentType
        // };base64,${req.profilePic.data.toString("base64")}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.editData = (req, res) => {
  debugger;
  const id = req.body._id;
  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;
  const phone = req.body.phone;
  const imageFile = req.file;
  Users.findById(id)
    .then((user) => {
      user.name = name;
      user.age = age;
      user.email = email;
      user.phone = phone;
      if (imageFile) {
        user.imageURL = {
          data: Buffer.from(imageFile.buffer, "base64"),
          contentType: imageFile.mimetype,
        };
      }
      return user.save();
    })
    .then((result) => {
      console.log("Updated");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.render("error", {
        title: "Error",
        path: "",
        message: err.message,
        // profilePic: `data:${
        //   req.profilePic.contentType
        // };base64,${req.profilePic.data.toString("base64")}`,
      });
    });
};

exports.deleteData = (req, res) => {
  const id = req.body._id;
  const clgId = req.body.clgId;
  Users.findByIdAndDelete(id)
    .then((result) => {
      console.log("Deleted");
      Colleges.findById(clgId)
        .then((collegeData) => {
          return collegeData.deleteStudentId(id);
        })
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getDataById = (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .select("name age -_id")
    .populate("collegeId", "name -_id")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
};

exports.getstudentsData = (req, res) => {
  Colleges.find()
    .populate("students")
    .then((data) =>
      res.render("viewStudents", {
        title: "Students",
        path: "/students",
        data,
        // profilePic: `data:${
        //   req.profilePic.contentType
        // };base64,${req.profilePic.data.toString("base64")}`,
      })
    )
    .catch((err) => console.log(err));
};
