const User = require("../../models/user");
const Tweet = require("../../models/tweet");

const getUserWithTweets = async (req, res) => {
  try {
    const users = await User.find();
    const userWithTweet = users.filter((user) => user.tweets.length > 0);
    const ids = userWithTweet.flatMap((user) => user.tweets);
    const tweets = await Tweet.find({ _id: { $in: ids } });
    const copyTweet = tweets.slice();
    const copyUser = userWithTweet.slice();

    res.status(200).json({
      success: true,
      user: copyUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const followOrUnfollowUser = async (req, res) => {
  try {
    const { search } = req.query;
    const user = await User.findOne({ username: search });
    const currentUser = await User.findById(req.user.id);

    if (user._id.toString() == currentUser._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Something Went Wrong!" });
    }

    if (user.followers.includes(currentUser._id)) {
      const indexFollower = user.followers.indexOf(currentUser._id);
      const indexFollowing = user.followings.indexOf(user._id);
      user.followers.splice(indexFollower, 1);
      currentUser.followings.splice(indexFollowing, 1);
      await user.save();
      await currentUser.save();

      res.status(200).json({
        success: true,
        message: "User unfollowed",
      });
    } else {
      user.followers.push(currentUser._id);
      currentUser.followings.push(user._id);
      await user.save();
      await currentUser.save();

      res.status(200).json({
        success: true,
        message: "User Followed",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const { search } = req.query;
    const user = await User.findOne({ username: search });
    const ids = user.followers.map((follower) => follower);
    const query = { _id: { $in: ids } };
    const userFollowers = await User.find(query);
    res.status(200).json({
      success: true,
      users: userFollowers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserFollowings = async (req, res) => {
  try {
    const { search } = req.query;
    const user = await User.findOne({ username: search });
    const ids = user.followings.map((following) => following);

    const query = { _id: { $in: ids } };
    const userFollowings = await User.find(query);
    res.status(200).json({
      success: true,
      users: userFollowings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getUserFollowers,
  followOrUnfollowUser,
  getUserFollowings,
  getUserWithTweets,
};
