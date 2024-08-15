const router = require("express").Router();
const { signup, login } = require("../../controllers/Auth/index");
const validateToken = require("../../middleware/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;
