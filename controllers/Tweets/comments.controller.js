const Tweet = require("../../models/tweet");

const createComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "Empty comment not allowed!" });
    }

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: "Tweet Not Found",
      });
    }

    tweet.comments.push({ user: req.user.id, comment: comment });

    await tweet.save();
    res.status(200).json({
      success: true,
      message: "Comment Added!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    console.log(tweet);
    const comno = req.query.comno;

    if (!tweet) {
      res.status(404).json({
        success: false,
        message: "Tweet Not Found!",
      });
    }

    if (comno == "" || !comno) {
      return res.status(400).json({
        success: false,
        message: "Comment Id is required!",
      });
    }

    const index = tweet.comments.findIndex(
      (comment) => comment._id.toString() == comno
    );
    tweet.comments.splice(index, 1);
    await tweet.save();

    res.status(200).json({
      success: true,
      message: "Comment Deleted!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTweetComment = async (req, res) => {
  try {
    const userComment = await Tweet.findById(req.params.id)
      .select("comments")
      .populate({
        path: "comments.user",
        select: `name username avatar createdAt`,
      });

    if (!userComment) {
      return res.status(404).json({ success: false, message: "Not found!" });
    }

    res.status(200).json({
      success: true,
      data: userComment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createComment, deleteComment, getTweetComment };
