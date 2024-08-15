const validateToken = require("../../middleware/auth");
const {
  getSingleUser,
  getTweetsOfFollowing,
  getUsers,
  searchUser,
} = require("../../controllers/Feed/feed.controller");

const {
  followOrUnfollowUser,
  getUserFollowers,
  getUserFollowings,
  getUserWithTweets,
} = require("../../controllers/UserProfile/userProfile.controller");

const {
  editProfile,
  getCurrentUser,
} = require("../../controllers/Users/user.controller");

const validateToken = require("../../middleware/auth");

const router = require("express").Router();

router.route("/edit").patch(validateToken, editProfile);

router.route("/current").get(validateToken, getCurrentUser);
router.route("/users").get(validateToken, getUsers);
router.route("/users/:id").get(getSingleUser);
router.route("/find").get(validateToken, searchUser);

router.route("/user-tweets").get(getUserWithTweets);

router.route("/feed").get(validateToken, getTweetsOfFollowing);

router.route("/fllw-unfllw").patch(validateToken, followOrUnfollowUser);

router.route("/followers").get(getUserFollowers);
router.route("/followings").get(getUserFollowings);

module.exports = router;
