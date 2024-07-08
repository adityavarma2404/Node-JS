const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "Colleges",
    required: true,
  },
});

module.exports = mongoose.model("Users", usersSchema);

// const mongodb = require("mongodb");
// const getDB = require("../utils/database").getDB;

// const ObjectId = mongodb.ObjectId;

// function readFileFromDB(cb) {
//   const db = getDB();
//   return db
//     .collection("users")
//     .find()
//     .toArray()
//     .then((result) => {
//       cb(result);
//     })
//     .catch((err) => console.log(err));
// }

// function updateDataToDB(data) {
//   const db = getDB();
//   const { _id, ...rest } = data;
//   return db
//     .collection("users")
//     .updateOne({ _id: new ObjectId(data._id) }, { $set: rest })
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err));
// }

// function createDataToDB(data) {
//   const db = getDB();
//   return db
//     .collection("users")
//     .insertOne(data)
//     .then((result) => {
//       db.collection("colleges").updateOne(
//         { _id: new ObjectId(data.collegeId) },
//         { $push: { students: result.insertedId } }
//       );
//     })
//     .catch((err) => console.log(err));
// }

// function getDataByIdFromDB(cb, id) {
//   const db = getDB();
//   return db
//     .collection("users")
//     .find({ _id: new ObjectId(id) })
//     .next()
//     .then((res) => {
//       cb(res);
//     })
//     .catch((err) => console.log(err));
// }

// function deleteDataInDB(id) {
//   const db = getDB();
//   return db
//     .collection("users")
//     .deleteOne({ _id: new ObjectId(id) })
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err));
// }

// function getStudentDetails(data) {
//   const db = getDB();
//   let newArr = [];
//   data.map(async (each) => {
//     const studentIds = each.students.map((id) => new ObjectId(id));
//     const students = await db
//       .collection("users")
//       .find({ _id: { $in: studentIds } })
//       .toArray();
//     newArr.push({ name: each.name, students });
//   });
// }

// async function getstudentsDataFromDB(cb) {
//   const db = getDB();
//   let newArr = [];

//   try {
//     const colleges = await db.collection("colleges").find().toArray();

//     const promises = colleges.map(async (each) => {
//       const studentIds = each.students.map((id) => new ObjectId(id));
//       const students = await db
//         .collection("users")
//         .find({ _id: { $in: studentIds } })
//         .toArray();
//       return { name: each.name, students };
//     });

//     newArr = await Promise.all(promises);

//     console.log("newArr", newArr);
//     cb(newArr);
//   } catch (err) {
//     console.log(err);
//   }
// }

// module.exports = {
//   readFileFromDB,
//   createDataToDB,
//   deleteDataInDB,
//   updateDataToDB,
//   getDataByIdFromDB,
//   getstudentsDataFromDB,
// };
