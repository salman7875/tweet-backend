const router = require("express").Router();

const {
  getTweetComment,
  createComment,
  deleteComment,
} = require("../../controllers/Tweets/Comments.controller");
const validateToken = require("../../middleware/auth");


router
  .route("/comment/:id")
  .get(getTweetComment)
  .post(validateToken, createComment)
  .delete(validateToken, deleteComment);

module.exports = router;
