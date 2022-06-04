const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Express check. Returns status if not authirized.
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("!!!")
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          if (user) res.json({ status: true, username: user.username });
          else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};
module.exports.checkTokenLight = async (token) => {
  if (token) {
    const decodedJWT = jwt.verify(
      token, 
      process.env.ACCESS_TOKEN_SECRET,
      (err, decodedToken) => err ? undefined : decodedToken
    );
    const userFound = await User.findById(decodedJWT.id)
      .then((user) => (!user || user === undefined) ? false : {
        user: user._id, 
        username: user.username,
        status: user.status
      });
    return userFound ? userFound : false;
  } else {
    return false;
  }
};
module.exports.getUserData = async function(token) {
  function decodeToken(token) {
    let decToken = {};
    if (token) {
      jwt.verify( token, process.env.ACCESS_TOKEN_SECRET,
        async (err, decodedToken) => {
          if (err) decToken = {};
          else {
            decToken = decodedToken;
          }
        }
      );
    } else {
      decToken = {};
    }
    return decToken;
  }
  async function mapDataFromDecodedToken(decodedToken) {
    const user = await User.findById(decodedToken.id);
    let token = {};
    if (user) token = { status: user.status, username: user.username };
    else token = {};
    return token;
  }

  let decodedToken = decodeToken(token);
  let outData = await mapDataFromDecodedToken(decodedToken);
  return outData;
}