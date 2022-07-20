const JWT = require ("./AuthUtils/JWT")
const { handleErrors } = require("./AuthUtils/handleAuthErrors")

module.exports._is_logged_in = (username, password) => {
  const sharepointBot = {
    name: "bot1",
    pass: "12345"
  }
  return (
    username === sharepointBot.name &&
    password === sharepointBot.pass
  )
}
module.exports._LOGIN_BOT = (user, res) => {
  console.log("Hello, I am sharepoint bot")
  try {
    const token = JWT.createToken(user._id);
    res.cookie("jwt", token, { httpOnly: false,  maxAge: JWT.maxAge * 1000 })

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

module.exports._UPLOAD_LINK = () => {
  
}