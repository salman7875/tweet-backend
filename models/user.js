const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String },
    avatar: { type: String },
    bgImg: { type: String },
    bio: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }]
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
