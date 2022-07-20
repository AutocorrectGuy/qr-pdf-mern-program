const jwt = require("jsonwebtoken");

module.exports.maxAge = 3 * 24 * 60 * 60

module.exports.createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: this.maxAge,
  });
};