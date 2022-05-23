const { login_POST, register_POST, logout_GET, verify_GET, GET_TOKEN } = require("../controllers/auth.controllers");
const { checkUser, checkUserToken } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/logout", logout_GET);
router.post("/register", register_POST);
router.post("/login", login_POST);
router.get("/verify", verify_GET); 
router.get("/token", GET_TOKEN); 

router.post("/secret", checkUser); 
module.exports = router;