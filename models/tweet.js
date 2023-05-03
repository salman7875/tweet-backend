const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Tweet', tweetSchema)
