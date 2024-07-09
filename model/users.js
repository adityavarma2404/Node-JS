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

module.exports = mongoose.model("Users", usersSchema);
