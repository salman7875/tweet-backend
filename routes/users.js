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
  getUserWithTweets,
  getTweetsOfFollowing,
  editProfile
} = require('../controllers/User')
const validateToken = require('../middleware/auth')

const router = require('express').Router()

router.route('/register').post(signup)    
router.route('/login').post(login)
router.route('/edit').put(validateToken, editProfile)
router.route('/feed').get(validateToken, getTweetsOfFollowing)
router.route('/users').get(validateToken, getUsers)
router.route('/users/:id').get(getSingleUser)
router.route('/find').post(searchUser)
router.route('/user-tweets').get(getUserWithTweets)
router.route('/current').get(validateToken, getCurrentUser)
router.route('/users/:id').put(validateToken, followOrUnfollowUser)
router.route('/users/:id/followers').get(getUserFollowers)
router.route('/users/:id/followings').get(getUserFollowings)

module.exports = router
