const { register, login, logout_get } = require("../controllers/auth.controllers");
const { checkUser } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/logout", logout_get);
router.get("/verify", checkUser); 
router.post("/secret", checkUser); 
router.post("/register", register);
router.post("/login", login);

module.exports = router;