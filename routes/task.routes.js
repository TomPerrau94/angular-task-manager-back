const express = require("express");
const router = express.Router();

const { Task } = require("../models");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { List } = require("../models/list.model");

// Get all tasks from a List
router.get("/lists/:listId/tasks", isAuthenticated, async (req, res) => {
  try {
    const listId = req.params.listId;

    const tasks = await Task.find({ _listId: listId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get specific task
router.get(
  "/lists/:listId/tasks/:taskId",
  isAuthenticated,
  async (req, res) => {
    try {
      const listId = req.params.listId;
      const taskId = req.params.taskId;

      const task = await Task.find({ _listId: listId, _id: taskId });
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Create new task
router.post("/lists/:listId/tasks", isAuthenticated, async (req, res) => {
  try {
    const title = req.fields.title;

    const listId = req.params.listId;

    const listToUpdate = await List.findOne({
      _id: listId,
      _userId: req.user._id,
    });

    if (listToUpdate) {
      const newTask = new Task({
        title: title,
        _listId: listId,
      });

      await newTask.save();

      res.status(200).json(newTask);
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put(
  "/lists/:listId/tasks/:taskId",
  isAuthenticated,
  async (req, res) => {
    try {
      const listId = req.params.listId;
      const taskId = req.params.taskId;

      const listToUpdate = await List.findOne({
        _id: listId,
        _userId: req.user._id,
      });

      if (listToUpdate) {
        await Task.findOneAndUpdate(
          {
            _id: taskId,
            _listId: listId,
          },
          {
            $set: req.fields,
          }
        );

        res.status(200).json({ message: "Task updated" });
      } else {
        res.status(404).json({ message: "List not found" });
      }
    } catch (error) {}
  }
);

// Delete task
router.delete(
  "/lists/:listId/tasks/:taskId",
  isAuthenticated,
  async (req, res) => {
    try {
      const listId = req.params.listId;
      const taskId = req.params.taskId;

      const listToUpdate = await List.findOne({
        _id: listId,
        _userId: req.user._id,
      });

      if (listToUpdate) {
        const taskToDelete = await Task.findOne({
          _id: taskId,
          _listId: listId,
        });

        if (taskToDelete) {
          taskToDelete.deleteOne();
          res.status(200).json({ message: "Task deleted" });
        } else {
          res.status(404).json({ message: "Task not found" });
        }
      } else {
        res.status(404).json({ message: "List not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
