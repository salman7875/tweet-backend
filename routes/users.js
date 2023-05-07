const {
  signup,
  login,
  followOrUnfollowUser,
  getUsers,
  getCurrentUser,
  getSingleUser,
  getUserFollowers,
  getUserFollowings,
  searchUser,
  getUserWithTweets
} = require('../controllers/User')
const validateToken = require('../middleware/auth')

const router = require('express').Router()

router.route('/register').post(signup)
router.route('/login').post(login)
router.route('/users').get(getUsers)
router.route('/users/:id').get(getSingleUser)
router.route('/find').post(searchUser)
router.route('/user-tweets').get(getUserWithTweets)
router.route('/current').get(validateToken, getCurrentUser)
router.route('/users/follow/:id').post(validateToken, followOrUnfollowUser)
router.route('/users/:id/followers').get(getUserFollowers)
router.route('/users/:id/followings').get(getUserFollowings)

module.exports = router
