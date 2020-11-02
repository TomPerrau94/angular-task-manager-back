const express = require("express");
const router = express.Router();

const { List } = require("../models");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { Task } = require("../models/task.model");

// Get all lists
router.get("/lists", isAuthenticated, async (req, res) => {
  try {
    const lists = await List.find({ _userId: req.user._id });
    res.status(200).json(lists);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create new list
router.post("/lists", isAuthenticated, async (req, res) => {
  try {
    const title = req.fields.title;

    const newList = new List({
      title: title,
      _userId: req.user._id,
    });

    await newList.save();

    res.status(200).json(newList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update list
router.put("/lists/:listId", isAuthenticated, async (req, res) => {
  try {
    const listId = req.params.listId;

    const listToUpdate = await List.findById({
      _id: listId,
      _userId: req.user._id,
    });

    if (listToUpdate) {
      listToUpdate.title = req.fields.title;

      await listToUpdate.save();
    }

    res.status(200).json({ message: "List updated" });
  } catch (error) {}
});

// Delete list
router.delete("/lists/:listId", isAuthenticated, async (req, res) => {
  try {
    const listId = req.params.listId;

    const listToDelete = await List.findById({
      _id: listId,
      _userId: req.user._id,
    });

    if (listToDelete) {
      listToDelete.deleteOne();
      Task.deleteMany({
        _listId: listId,
      });
    }

    res.status(200).json({ message: "List deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
