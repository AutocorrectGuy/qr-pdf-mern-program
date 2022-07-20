const User = require("../models/User");
const SHAREPOINT_BOT = require("./bot.controller")
const { getUserData, checkTokenLight } = require("../middleware/auth.middleware");
const { handleErrors } = require("./AuthUtils/handleAuthErrors")
const JWT = require ("./AuthUtils/JWT")

require("dotenv").config();

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
    const token = JWT.createToken(user._id);
    res.cookie("hello", {}, { httpOnly: false, maxAge: JWT.maxAge * 1000 });
    res.cookie("jwt", token, { httpOnly: true, maxAge: JWT.maxAge * 1000 })

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
  const user = await User.login(username, password);
  
  SHAREPOINT_BOT._is_logged_in(username, password)
    ? SHAREPOINT_BOT._LOGIN_BOT(user, res)
    : loginUser(user, res)
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

function loginUser(user, res) {
  console.log("Hello", user.username)
  try {
    const token = JWT.createToken(user._id);
    res.cookie("hello", {}, { httpOnly: false, maxAge: JWT.maxAge * 1000 })
    res.cookie("jwt", token, { httpOnly: true,  maxAge: JWT.maxAge * 1000 })

    res.status(200).json({
      user: user._id,
      username: user.username,
      status: user.status
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
}