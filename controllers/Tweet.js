const Tweet = require('../models/tweet')
const User = require('../models/user')

// CREATE
const createTweet = async (req, res) => {
  try {
    const newTweetData = {
      content: req.body.content,
      author: req.user.id
    }

    const newTweet = await Tweet.create(newTweetData)

    // PUSH THE TWEET IN USER TWEET ARRAY
    const user = await User.findById(req.user.id)
    user.tweets.push(newTweet._id)
    await user.save()

    res.status(201).json({
      success: true,
      tweet: newTweet
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// DELETE
const deleteTweets = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)

    if (!tweet) {
      res.status(404).json({
        success: false,
        message: 'Tweet Not found'
      })
    }

    if (tweet.author.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      })
    }

    await Tweet.findByIdAndDelete(req.params.id)

    const user = await User.findById(req.user.id)
    const index = user.tweets.indexOf(req.params.id)
    user.tweets.splice(index, 1)
    await user.save()

    res.status(201).json({ success: true, message: 'Tweet Deleted!' })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// UPDATE
const updateTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)

    if (!tweet) {
      res.status(404).json({
        success: false,
        message: 'Tweet Not Found'
      })
    }

    if (tweet.author.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      })
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(201).json({
      success: true,
      tweet: updatedTweet
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET ALL
const getAllTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, resultes: tweets.length, tweets })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET MY TWEETS
const getMyTweets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const ids = user.tweets.map(tweet => tweet)

    const query = { _id: { $in: ids } }
    const userTweets = await Tweet.find(query)
    res.status(200).json({ success: true, tweets: userTweets })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// Get Single Tweet
const getSingleTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
      res.status(404).json({
        success: false,
        message: 'Tweet Not Found!'
      })
    }
    res.status(200).json({ success: true, tweet })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getTweetOfParticularUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  const tweetId = user.tweets.map(tweet => tweet)

  const tweets = await Tweet.find({ _id: { $in: tweetId } })

  if (!tweets) {
    res.status(404).json({
      success: false,
      message: 'No Tweets found with this User'
    })
  }

  res.status(200).json({
    success: true,
    tweets
  })
}

const likeOrUnlikeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
      res.status(404).json({
        success: false,
        message: 'Tweet Not Found!'
      })
    }

    if (tweet.likes.includes(req.user.id)) {
      const index = tweet.likes.indexOf(req.user.id)
      tweet.likes.splice(index, 1)
      await tweet.save()
      return res.status(200).json({
        success: true,
        message: 'Tweet Unliked'
      })
    } else {
      tweet.likes.push(req.user.id)
      await tweet.save()
      return res.status(200).json({
        success: true,
        message: 'Tweet Liked'
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const createComment = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet Not Found'
      })
    }

    tweet.comments.push({ user: req.user.id, comment: req.body.comment })
    await tweet.save()
    res.status(200).json({
      success: true,
      message: 'Comment Added!'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const deleteComment = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
      res.status(404).json({
        success: false,
        message: 'Tweet Not Found!'
      })
    }

    // Checking if owner wants to delete
    if (tweet.author.toString() === req.user.id.toString()) {
      if (req.body.commentId === undefined) {
        res.status(400).json({
          success: false,
          message: 'Comment Id is required!'
        })
      }

      tweet.comments.forEach((item, i) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return tweet.comments.splice(i, 1)
        }
      })
      await tweet.save()

      res.status(200).json({
        success: true,
        message: 'Comment Deleted!'
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getTweetComment = async (req, res) => {
  try {
    const userComment = await Tweet.findById(req.params.id)
      .select('createdAt comments')
      .populate({
        path: 'comments.user',
        select: `name avatar`
      })

    res.status(200).json({
      success: true,
      userComment
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  createTweet,
  deleteTweets,
  updateTweet,
  getAllTweets,
  getMyTweets,
  getSingleTweet,
  getTweetOfParticularUser,
  likeOrUnlikeTweet,
  createComment,
  deleteComment,
  getTweetComment
}
