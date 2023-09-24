const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const User = require("../models/user");
const Tweet = require("../models/tweet");

const signup = async (req, res) => {
  try {
    const { username, email, password, avatar, name } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Fill up the field!",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
      name,
    });
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
          username: user.username,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );
    res.status(201).json({
      success: true,
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill up the field!",
      });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user with this username!",
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user: {
            id: user._id,
            username: user.username,
            username: user.username,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "90d" }
      );
      res.status(200).json({ success: true, user, token });
    } else {
      res.status(401);
      throw new Error("Email or password is not valid!");
    }
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

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found!" });
    }
    res.status(200).json({ success: true, message: 'User Updated', user: user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

const searchUser = async (req, res) => {
  try {
    const { username } = req.body;
    const allUser = await User.find({});
    const user = allUser.filter(user => user.username.includes(username))
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

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
    // find user to follow
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    // Check if you follow him or not
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
    const user = await User.findById(req.params.id);
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
    const user = await User.findById(req.params.id);
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

module.exports = {
  signup,
  login,
  getUsers,
  getCurrentUser,
  editProfile,
  getSingleUser,
  searchUser,
  getUserWithTweets,
  followOrUnfollowUser,
  getUserFollowers,
  getUserFollowings,
  getTweetsOfFollowing,
};
