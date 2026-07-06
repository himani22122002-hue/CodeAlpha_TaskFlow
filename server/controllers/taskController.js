const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;

    // Validate Project
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate User (if assignedTo is provided)
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("project").populate("assignedTo", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project")
      .populate("assignedTo", "name email");
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { project, assignedTo } = req.body;

    // Validate Project if being updated
    if (project) {
        const projectExists = await Project.findById(project);
        if (!projectExists) {
          return res.status(404).json({ message: "Project not found" });
        }
    }

    // Validate User if being updated
    if (assignedTo) {
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
          return res.status(404).json({ message: "Assigned user not found" });
        }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
