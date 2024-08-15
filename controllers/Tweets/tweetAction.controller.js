const Tweet = require("../../models/tweet");

// Get Single Tweet
const getSingleTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      res.status(404).json({
        success: false,
        message: "Tweet Not Found!",
      });
    }
    res.status(200).json({ success: true, tweet });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const likeOrUnlikeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      res.status(404).json({
        success: false,
        message: "Tweet Not Found!",
      });
    }

    if (tweet.likes.includes(req.user.id)) {
      const index = tweet.likes.indexOf(req.user.id);
      tweet.likes.splice(index, 1);
      await tweet.save();
      return res.status(200).json({
        success: true,
        message: "Tweet Unliked",
        likes: tweet.likes.length,
      });
    } else {
      tweet.likes.push(req.user.id);
      await tweet.save();
      return res.status(200).json({
        success: true,
        message: "Tweet Liked",
        likes: tweet.likes.length,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getSingleTweet,
  likeOrUnlikeTweet,
};
