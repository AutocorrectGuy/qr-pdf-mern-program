const { register, login } = require("../controllers/auth.controllers");
const { checkUser } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/verify", checkUser); 
router.post("/secret", checkUser); 
router.post("/register", register);
router.post("/login", login);

module.exports = router;