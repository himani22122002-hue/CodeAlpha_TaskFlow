const Comment = require("../models/Comment");
const Task = require("../models/Task");

// Create Comment
exports.createComment = async (req, res) => {
  try {
    const { task, text } = req.body;

    // Verify task exists
    const taskExists = await Task.findById(task);
    if (!taskExists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = await Comment.create({
      task,
      user: req.user._id,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Comments by Task
exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Verify task exists
    const taskExists = await Task.findById(taskId);
    if (!taskExists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comments = await Comment.find({ task: taskId }).populate("user", "name email");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure user is the author
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure user is the author
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
