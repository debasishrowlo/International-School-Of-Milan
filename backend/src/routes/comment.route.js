import express from 'express';
const router = express.Router();
import Comment from '../model/comment.model.js';
import Post from '../model/post.model.js';

// Create a Comment
router.post('/post-comment', async (req, res) => {
  try {
    console.log(req.body)
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(200).send({
      message: "Comment created successfully",
      comment: newComment
    });
  } catch (error) {
    console.error("An Error Occured While Posting Comment.", error);
    res.status(500).send({
      message: "An error occurred while posting new comment"
    });

  }
})

// Get  comment count 
router.get('/total-comments', async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments({});
    res.status(200).send({
      message: "Total comments Count",
      totalComments
    })

  } catch (error) {
    console.error("An Error Occured While Comment Count.", error);
    res.status(500).send({
      message: "An error occurred while Comment Count"
    });

  }
})

router.delete('/delete-comment/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      message: "Comment Deleted Successfully"
    })
  } catch (error) {
    console.error("An Error Occured While Deleting Comment.", error);
    res.status(500).send({
      message: "An error occurred while deleting comment"
    });
  }
})


export default router;
