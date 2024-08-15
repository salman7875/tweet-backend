const router = require("express").Router();

const {
  createTweet,
  updateTweet,
  getAllTweets,
  getMyTweets,
} = require("../../controllers/Tweets/Tweets.controller");
const validateToken = require("../../middleware/auth");

// CREATE
router.route("/create").post(validateToken, createTweet);
router.route("/edit/:id").patch(validateToken, updateTweet);

// FETCH
router.route("/").get(getAllTweets);
router.route("/current").get(validateToken, getMyTweets);

// COMMENTS

module.exports = router;
