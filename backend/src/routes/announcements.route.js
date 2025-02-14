import express from 'express';
const router = express.Router();
import Announcement from '../model/announcements.model.js';
import Comment from '../model/comment.model.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';

// Create an announcement
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(419).send({ message: "Content is required" });
    }

    const announcement = new Announcement({
      ...req.body,
      author: req.user.id,
    });

    await announcement.save();

    res.status(201).send({
      message: "Announcement Created Successfully",
      announcement: {
        ...announcement.toJSON(),
        author: {
          username: req.user.username,
        }
      },
    });

  } catch (error) {
    console.error("Error Creating Announcement:", error);
    res.status(500).send({ message: "Error Creating Announcement" });
  }
});

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate({
        path: "author",
        select: "username -_id",
      })
      .sort({ createdAt: -1 });

    res.status(200).send(announcements);

  } catch (error) {
    console.error("Error Fetching Announcements:", error);
    res.status(500).send({ message: "Error Fetching Announcements" });
  }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findById(announcementId)
      .populate('author', 'email');

    if (!announcement) {
      return res.status(404).send({ message: "Announcement Not Found" });
    }

    const comments = await Comment.find({ announcementId: announcementId })
      .populate('user', "username email");

    res.status(200).send({
      message: "Announcement Retrieved Successfully",
      announcement: announcement,
      comments: comments
    });

  } catch (error) {
    console.error("Error Fetching Single Announcement:", error);
    res.status(500).send({ message: "Error Fetching Single Announcement" });
  }
});

// Delete an announcement
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findByIdAndDelete(announcementId);

    if (!announcement) {
      return res.status(404).send({ message: "Announcement Not Found" });
    }

    // Delete related comments
    await Comment.deleteMany({ announcementId: announcementId });

    res.status(200).send({
      message: "Announcement Deleted Successfully",
      announcement: announcement
    });

  } catch (error) {
    console.error("Error Deleting Announcement:", error);
    res.status(500).send({ message: "Error Deleting Announcement" });
  }
});
export default router;
