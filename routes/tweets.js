const {
  createTweet,
  deleteTweets,
  updateTweet,
  getAllTweets,
  getMyTweets,
  getSingleTweet,
  likeOrUnlikeTweet,
  createComment,
  deleteComment,
  getTweetOfParticularUser,
  getTweetComment
} = require('../controllers/Tweet')
const validateToken = require('../middleware/auth')

const router = require('express').Router()

router.route('/').get(getAllTweets)
router.route('/current').get(validateToken, getMyTweets)
router.route('/create').post(validateToken, createTweet)
router.route('/:id').get(getTweetOfParticularUser)
router.route('/comments/:id').get(getTweetComment)
router
  .route('/:id')
  .post(validateToken, createComment)
  .delete(validateToken, deleteComment)
router
  .route('/action/:id')
  .get(getSingleTweet)
  .post(validateToken, likeOrUnlikeTweet)
  .put(validateToken, updateTweet)
  .delete(validateToken, deleteTweets)

module.exports = router
