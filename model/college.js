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

collegeSchema.methods.addStudentId = function (studentId) {
  this.students.push(studentId);
  return this.save();
};
collegeSchema.methods.deleteStudentId = function (studentId) {
  const newStudentList = this.students.filter((id) => {
    return studentId.toString() !== id.toString();
  });
  this.students = newStudentList;
  return this.save();
};

module.exports = mongoose.model("Colleges", collegeSchema);
