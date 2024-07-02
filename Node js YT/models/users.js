const mongoose = require("mongoose");

// schema for users data
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    gender: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// user is a collection name
const User = mongoose.model("user", userSchema);

module.exports = User;