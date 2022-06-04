const mongoose = require("mongoose");
// const { isEmail } = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
    unique: true,
  },
  // email: {
  //   type: String,
  //   required: [true, 'Please enter an email'],
  //   unique: true,
  //   lowercase: true,
  //   validate: [isEmail, 'Please enter a valid email']
  // },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  status: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect username");
};

module.exports = mongoose.model("user", userSchema);