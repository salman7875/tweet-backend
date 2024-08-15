const User = require("../../models/user");
const Tweet = require("../../models/tweet");

const getTweetsOfFollowing = async (req, res) => {
  try {
    // GET FOLLOWING USER WITH TWEETS
    const currentUser = await User.findById(req.user.id);

    // QUERY TWEETS OF ABOVE USER
    const ids = currentUser.followings.map((following) => following);
    const tweets = await Tweet.find({ author: { $in: ids } }).populate(
      "author"
    );
    res.status(200).json({
      success: true,
      tweets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).limit(5);
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No users found!",
      });
    }
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const { search } = req.query;
    const allUser = await User.find({});
    const user = allUser.filter((user) => user.username.includes(search));
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "No user found!",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getTweetsOfFollowing, getUsers, getSingleUser, searchUser };
