const Tweet = require("../../models/tweet");
const User = require("../../models/user");

const createTweet = async (req, res) => {
  try {
    const newTweetData = {
      content: req.body.content,
      caption: req.body.caption,
      author: req.user.id,
    };

    const newTweet = await Tweet.create(newTweetData);

    // PUSH THE TWEET IN USER TWEET ARRAY
    const user = await User.findById(req.user.id);
    user.tweets.push(newTweet._id);
    await user.save();

    res.status(201).json({
      success: true,
      tweet: newTweet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteTweets = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      res.status(404).json({
        success: false,
        message: "Tweet Not found",
      });
    }

    if (tweet.author.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    await Tweet.findOneAndDelete({ author: req.user.id });

    const user = await User.findById(req.user.id);
    const index = user.tweets.indexOf(req.params.id);
    user.tweets.splice(index, 1);
    await user.save();

    res.status(201).json({ success: true, message: "Tweet Deleted!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      res.status(404).json({
        success: false,
        message: "Tweet Not Found",
      });
    }

    if (tweet.author.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
      { author: req.user.id },
      req.body,
      { new: true }
    );
    res.status(201).json({
      success: true,
      data: updatedTweet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllTweets = async (req, res) => {
  try {
    const { username } = req.query;
    let tweets = [];
    if (!username) {
      tweets = await Tweet.find().sort({ createdAt: -1 });
    } else {
      const { _id: userId } = await User.findOne({ username: username }, "_id");
      tweets = await Tweet.find({ author: userId });
    }
    res.status(200).json({ success: true, data: tweets });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyTweets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const ids = user.tweets.map((tweet) => tweet);

    const query = { _id: { $in: ids } };
    const userTweets = await Tweet.find(query);
    res.status(200).json({ success: true, tweets: userTweets });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createTweet,
  deleteTweets,
  updateTweet,
  getAllTweets,
  getMyTweets,
};
