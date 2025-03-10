import express from 'express';
const router = express.Router();

import Post from '../model/post.model.js';
import Comment from "../model/comment.model.js"
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import userDataPermission from '../middleware/userDataPermission.js';

// Get all Posts
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        message: "Type missing",
      })
    }

    // if (search) {
    //   query = {
    //     ...query,
    //     $or: [
    //       { title: { $regex: search, $options: 'i' } },
    //       { content: { $regex: search, $options: 'i' } }
    //     ]
    //   }
    // }

    // if (category) {
    //   query = {
    //     ...query,
    //     category,
    //   }
    // }

    const postsResult = await Post
      .find({ type })
      .populate({ path: 'author', select: "username" })
      .sort({ createdAt: -1 })

    const posts = postsResult.map(post => ({
      ...post.toJSON(),
      comments: [],
    }))

    return res.status(200).send(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).send({ message: "Error fetching posts" })
  }
})

// Get Post by ID
router.get('/:id',verifyToken, async (req, res) => {
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
router.post("/", verifyToken, userDataPermission("admin", "moderator","creator"), async (req, res) => {
  try {
    // validate

    const newPost = new Post({
      type: req.body.type,
      title: req.body.title,
      coverImageUrl: req.body.coverImageUrl,
      content: req.body.content,
      description: req.body.description,
      author: req.user.id,
    })

    const post = await newPost.save()
    await post.populate("author", "username role")

    res.status(201).send({
      message: "Post Created Successfully",
      post,
    })
  } catch (error) {
    console.error("Error Creating Post:", error);
    res.status(500).send({ message: "Error Creating Post" })
  }
})

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author")
    console.log(post)

    if (!post) {
      return res.status(404).send()
    }

    if (post.author.id !== req.user.id) {
      return res.status(403).send()
    }

    Object.assign(post, req.body)
    await post.save()

    return res.status(200).send(post)
  } catch (error) {
    console.error("Error Updating Post:", error);
    res.status(500).send({ message: "Error Updating Post" });
  }
})

const roles = {
  admin: "admin",
  moderator: "moderator",
  creator: "creator",
}

// Delete a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
     if (req.user.role == "admin") {
      const post = await Post.deleteMany({
        _id: postId,
        role: "admin"
      })
      res.status(200).send({message:"Post data deleted Sucessfully", post})

    } else if (req.user.role == "moderator") {
      const post = await Post.deletedOne({
        _id:postId,
         role:"moderator"
      })

      res.status(200).send({message:"Post data deleted Sucessfully", post})
    } else if (req.user.role === roles.creator) {
      const post = await Post.findById(postId).populate("author")

      if (post.author.id === req.user.id) {
        await Comment.deleteMany({ post: post.id }); 
        await post.delete()
      }

      res.status(200).send({ message:"Post data deleted Sucessfully", post })
    }

  } catch (error) {
    console.error("Error Deleting Post:", error);
    res.status(500).send({ message: "Error Deleting Post" });
  }
})

router.get("/:id/comments", verifyToken, async (req, res) => {
  const postId = req.params.id

  const post = await Post.findById(postId).populate({
    path: "comments",
    populate: {
      path: "user",
      select: "-_id username",
    },
  })

  if (!post) {
    return res.status(404).send({ message: "Post not found" })
  }

  return res.status(200).send(post.comments)
})

router.post("/:id/comments", verifyToken, isAdmin, async (req, res) => {
  const postId = req.params.id

  const post = await Post.findById(postId)

  if (!post) {
    return res.status(404).send({ message: "Post not found" })
  }
  
  const comment = await Comment.create({
    text: req.body.comment,
    post: post.id,
    user: req.user.id,
  })

  const responseComment = await Comment
    .findById(comment.id)
    .select("-post")
    .populate("user", "-_id username")

  return res.status(201).send(responseComment)
})

export default router;
