const express = require('express');
const router = express.Router();

const Post = require('../model/post.model.js');
const Comment = require('../model/comment.model.js');
const verifyToken = require('../middleware/verifyToken.js');
const isAdmin = require('../middleware/isAdmin.js');

// Get all Posts
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, category } = req.query;
    console.log(search);

    let query = {}

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      }
    }

    if (category) {
      query = {
        ...query,
        category: category
      }
    }

    const postsResult = await Post.find(query)
      .populate({ path: 'author', select: "username" })
      .sort({ createdAt: -1 })

    const posts = postsResult.map(post => ({
      ...post.toJSON(),
      comments: [],
    }))

    res.status(200).send(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).send({ message: "Error fetching posts" })
  }
});

// Get Post by ID
router.get('/:id', async (req, res) => {
  try {
    // console.log(req.params.id);
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post Not Found" })
    }

    const comment = await Comment.find({ postId: postId }).populate('user', "username email");
    res.status(200).send({
      message: "Post Found",
      post: {
        ...post.toJSON(),
        comments: comment
      }
    })
  } catch (error) {
    console.error("Error Fetching Single Post:", error);
    res.status(500).send({ message: "Error Fetching Single Post" });
  }
})

// Related Posts
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ message: "Post is not found." })
    }
    const titleRegex = new RegExp(post.title.split(' ').join('|'), 'i');
    const relatedQuery = {
      _id: { $ne: id },
      title: { $regex: titleRegex }
    }
    const relatedPosts = await Post.find(relatedQuery);
    res.status(200).send(relatedPosts.map(post => post.toJSON()));
  } catch (error) {
    console.error("Error Fetching Related Post:", error);
    res.status(500).send({ message: "Error Fetching Related Post" });
  }
})

// Create A post
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    // validate
    console.log(req.body)

    const post = await Post.create({
      title: req.body.title,
      coverImageUrl: req.body.coverImageUrl,
      content: req.body.content,
      description: req.body.description,
      author: req.user._id,
      username: req.user.username
    })

    res.status(201).send({
      message: "Post Created Successfully",
      post: {
        ...post.toJSON(),
        author: {
          username: req.user.username
        },
      },
    })
  } catch (error) {
    console.error("Error Creating Post:", error);
    res.status(500).send({ message: "Error Creating Post" })
  }
})

// Update a post
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;

    console.log(req.body)

    const updatedPost = await Post.findByIdAndUpdate(postId, {
      ...req.body
    }, { new: true });
    console.log({ updatedPost })

    if (!updatedPost) {
      return res.status(404).send({ message: "Post Not Found" })
    }

    res.status(200).send({
      message: "Post Updated Successfully",
      post: {
        ...updatedPost.toJSON(),
        author: {
          username: req.user.username
        },
      },
    })
  } catch (error) {
    console.error("Error Updating Post:", error);
    res.status(500).send({ message: "Error Updating Post" });
  }
})

// Delete a post
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).send({ message: "Post Not Found" })
    }

    // Delete related comments
    await Comment.deleteMany({ postId: postId });

    res.status(200).send({
      message: "Post Deleted Successfully",
      post: post
    })

  } catch (error) {
    console.error("Error Deleting Post:", error);
    res.status(500).send({ message: "Error Deleting Post" });
  }
})

module.exports = router;
