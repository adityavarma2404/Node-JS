const mongodb = require("mongodb");
const getDB = require("../utils/database").getDB;

const ObjectId = mongodb.ObjectId;

function saveCollege(name, location) {
  const db = getDB();
  const college = { name, location };
  return db.collection("colleges").insertOne(college);
}

function findCollegeById(collegeId) {
  const db = getDB();
  return db
    .collection("colleges")
    .findOne({ _id: new ObjectId(collegeId) })
    .then((college) => {
      console.log(college);
      return college;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  saveCollege,
  findCollegeById,
};
