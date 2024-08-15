const router = require("express").Router();

const tweetActionRoute = require("./tweets/tweetAction.route");
const tweetCommentRoute = require("./tweets/tweetComment.route");
const tweetRoute = require("./tweets/tweets");

const userRoute = require("./user/user.route");
const authRoute = require("./user/auth.route");

router.use("auth", authRoute);
router.use("user", userRoute);
router.use("tweet", [tweetRoute, tweetActionRoute, tweetCommentRoute]);

module.exports = router;
