const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createComment);
router.get("/task/:taskId", protect, getCommentsByTask);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
