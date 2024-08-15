const router = require("express").Router();

const {
  getSingleTweet,
  likeOrUnlikeTweet,
} = require("../../controllers/Tweets/TweetAction.controller");
const { deleteTweets } = require("../../controllers/Tweets/Tweets.controller");
const validateToken = require("../../middleware/auth");

router
  .route("/action")
  .get(getSingleTweet)
  .patch(validateToken, likeOrUnlikeTweet)
  .delete(validateToken, deleteTweets);

module.exports = router;
