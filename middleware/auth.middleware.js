const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Express check. Returns status if not authirized.
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
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
    if (user) token = { status: true, username: user.username };
    else token = {};
    return token;
  }

  let decodedToken = decodeToken(token);
  let outData = await mapDataFromDecodedToken(decodedToken);
  return outData;
}