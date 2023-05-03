const jwt = require('jsonwebtoken')
const User = require('../models/user')

const signup = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists!'
      })
    }

    user = await User.create({ username, email, password, avatar })
    const token = jwt.sign({ _id: user._id }, 'twitter', { expiresIn: '90d' })
    res.status(201).json({ success: true, user: user, token: token })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'No user with this email!' })
    }

    if (user && user.password === password) {
      const token = jwt.sign(
        {
          user: {
            id: user._id,
            email: user.email,
            username: user.username
          }
        },
        process.env.JWT_SECRET,
        { expiresIn: '90d' }
      )
      res.status(200).json({ success: true, user, token })
    } else {
      res.status(401)
      throw new Error('Email or password is not valid!')
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)
    res.status(200).json(currentUser)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ success: false, message: 'No user found!' })
    }
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const followOrUnfollowUser = async (req, res) => {
  try {
    // find user to follow
    const user = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user.id)
    // Check if you follow him or not
    if (user.followers.includes(currentUser._id)) {
      const indexFollower = user.followers.indexOf(currentUser._id)
      const indexFollowing = user.followings.indexOf(user._id)
      user.followers.splice(indexFollower, 1)
      currentUser.followings.splice(indexFollowing, 1)
      await user.save()
      await currentUser.save()

      res.status(200).json({
        success: true,
        message: 'User unfollowed'
      })
    } else {
      user.followers.push(currentUser._id)
      currentUser.followings.push(user._id)
      await user.save()
      await currentUser.save()

      res.status(200).json({
        success: true,
        message: 'User Followed'
      })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  signup,
  login,
  followOrUnfollowUser,
  getUsers,
  getCurrentUser,
  getSingleUser
}
