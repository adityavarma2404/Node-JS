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
