const mongoose = require("mongoose");
const { login } = require("../controller/userController");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const userCollection = mongoose.model("users", userSchema);

module.exports = {
  userCollection,
  create: (field) => {
    const user = new userCollection(field);
    return user.save();
  },
  // login: (fields)
};
