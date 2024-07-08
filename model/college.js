const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const collegeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Colleges", collegeSchema);

// const mongodb = require("mongodb");
// const getDB = require("../utils/database").getDB;

// const ObjectId = mongodb.ObjectId;

// function saveCollege(name, location) {
//   const db = getDB();
//   const college = { name, location };
//   return db.collection("colleges").insertOne(college);
// }

// function findCollegeById(collegeId) {
//   const db = getDB();
//   return db
//     .collection("colleges")
//     .findOne({ _id: new ObjectId(collegeId) })
//     .then((college) => {
//       console.log(college);
//       return college;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// module.exports = {
//   saveCollege,
//   findCollegeById,
// };
