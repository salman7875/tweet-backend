const {
  signup,
  login,
  followOrUnfollowUser,
  getUsers,
  getCurrentUser,
  getSingleUser
} = require('../controllers/User')
const validateToken = require('../middleware/auth')

const router = require('express').Router()

router.route('/register').post(signup)
router.route('/login').post(login)
router.route('/users').get(getUsers)
router.route('/users/:id').get(getSingleUser)
router.route('/users/current').get(validateToken, getCurrentUser)
router.route('/users/follow/:id').post(validateToken, followOrUnfollowUser)

module.exports = router
