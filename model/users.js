const mongoose = require("mongoose");
const College = require("./college");

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

usersSchema.methods.addToCollegeDB = function (userId, collegeId) {
  College.findById(collegeId)
    .then((result) => {
      result.students.push(userId);
      return result.save();
    })
    .then((result) => console.log("Added to college"))
    .catch((err) => console.log(err));
};

module.exports = mongoose.model("Users", usersSchema);
