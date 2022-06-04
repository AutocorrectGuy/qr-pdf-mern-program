const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { getUserData, checkTokenLight } = require("../middleware/auth.middleware");

require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { username: "", password: "", secret: "" };

  console.log(err);
  if (err.hasOwnProperty("message")) {
    if (err.message === "incorrect username")
      errors.username = "That username is not registered";

    if (err.message === "incorrect password")
      errors.password = "That password is incorrect";

    if (err.code === 11000) {
      errors.username = "username is already registered";
      return errors;
    }

    if (err.message.includes("Users validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    // if(err.message.includes("Employee validation failed")) {
    //   errors.userStatus = "wow ma";
    // }
  }
  return errors;
};

module.exports.register_POST = async (req, res, next) => {
  const { username, password, secret, secretChecked } = req.body;

  console.log(secretChecked ? "ir čekots" : "nav iečekots :((");
  console.log("ievadītais secret kods: ", secret);

  let userStatus = "client";
  try {
    // check employee pass-code
    if(secretChecked === true && process.env.REGISTRATION_CODE !== secret) 
      throw ({message: "Employee validation failed"})
    else if(secretChecked === true && process.env.REGISTRATION_CODE === secret) 
      userStatus = "employee"

    // register user in database
    const user = await User.create({
      username, password, status: userStatus
    });

    // create login acess token
    const token = createToken(user._id);
    res.cookie("hello", {}, { httpOnly: false, maxAge: maxAge * 1000 });
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })

    res.status(201).json({
      user: user._id,
      username: user.username,
      status: userStatus
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login_POST = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);

    res.cookie("hello", {},  { httpOnly: false, maxAge: maxAge * 1000 });
    res.cookie("jwt", token, { httpOnly: true,  maxAge: maxAge * 1000 });

    res.status(200).json({
      user: user._id,
      username: user.username,
      status: user.status
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

module.exports.logout_GET = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.clearCookie("jwt");
  res.end();
}

module.exports.verify_GET = async (req, res) => {
  const userData = await getUserData(req.cookies.jwt);
  res.json(userData);
}
module.exports.GET_TOKEN = async (req, res) => {
  const token = await checkTokenLight(req.cookies.jwt);
  if (!token) {
    return res.status(401).json({ "info": "invalid token" });
  }
  else res.status(200).json(token);
}