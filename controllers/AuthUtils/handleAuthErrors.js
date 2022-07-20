module.exports.handleErrors = (err) => {
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