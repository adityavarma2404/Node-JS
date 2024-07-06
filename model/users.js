const mongodb = require("mongodb");
const getDB = require("../utils/database").getDB;

const ObjectId = mongodb.ObjectId;

function readFileFromDB(cb) {
  const db = getDB();
  return db
    .collection("users")
    .find()
    .toArray()
    .then((result) => {
      cb(result);
    })
    .catch((err) => console.log(err));
}

function updateDataToDB(data) {
  const db = getDB();
  const { _id, ...rest } = data;
  return db
    .collection("users")
    .updateOne({ _id: new ObjectId(data._id) }, { $set: rest })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function createDataToDB(data) {
  const db = getDB();
  return db
    .collection("users")
    .insertOne(data)
    .then((result) => {
      db.collection("colleges").updateOne(
        { _id: new ObjectId(data.collegeId) },
        { $push: { students: result.insertedId } }
      );
    })
    .catch((err) => console.log(err));
}

function getDataByIdFromDB(cb, id) {
  const db = getDB();
  return db
    .collection("users")
    .find({ _id: new ObjectId(id) })
    .next()
    .then((res) => {
      cb(res);
    })
    .catch((err) => console.log(err));
}

function deleteDataInDB(id) {
  const db = getDB();
  return db
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function getStudentDetails(data) {
  const db = getDB();
  let newArr = [];
  data.map(async (each) => {
    const studentIds = each.students.map((id) => new ObjectId(id));
    const students = await db
      .collection("users")
      .find({ _id: { $in: studentIds } })
      .toArray();
    newArr.push({ name: each.name, students });
  });
}

async function getstudentsDataFromDB(cb) {
  const db = getDB();
  let newArr = [];

  try {
    const colleges = await db.collection("colleges").find().toArray();

    const promises = colleges.map(async (each) => {
      const studentIds = each.students.map((id) => new ObjectId(id));
      const students = await db
        .collection("users")
        .find({ _id: { $in: studentIds } })
        .toArray();
      return { name: each.name, students };
    });

    newArr = await Promise.all(promises);

    console.log("newArr", newArr);
    cb(newArr);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  readFileFromDB,
  createDataToDB,
  deleteDataInDB,
  updateDataToDB,
  getDataByIdFromDB,
  getstudentsDataFromDB,
};

// The .next() method in MongoDB's Node.js driver is used when you are working with a cursor. A cursor is an object that allows you to iterate over the documents in a collection. The .find() method returns a cursor, which you can then use to retrieve documents one by one.
// In your function, the .next() method is used to retrieve the next document (in this case, it will be the first and only document because you are querying by _id) from the cursor. This is necessary because .find() returns a cursor, not the actual document(s). By using .next(), you can get the actual document from the cursor.
