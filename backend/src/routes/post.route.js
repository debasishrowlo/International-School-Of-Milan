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
    console.log(req.body)

    const post = await Post.create({
      title: req.body.title,
      coverImageUrl: req.body.coverImageUrl,
      content: req.body.content,
      description: req.body.description,
      author: req.user.userId,
      username: req.user.username
    })

    res.status(201).send({
      message: "Post Created Successfully",
      post: {
        ...post.toJSON(),
        author: {
          username: req.user.username,
          role:req.user.role,
          id:req.user.userId
        },
      },
    })
  } catch (error) {
    console.error("Error Creating Post:", error);
    res.status(500).send({ message: "Error Creating Post" })
  }
})

// Update a post
router.put("/:id", verifyToken,userDataPermission("admin", "moderator","creator"), async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming the user ID is stored in req.user.id
    const userRole = req.user.role;
  try {
       let updateCondition = { _id: postId };

        if (userRole == "admin") {
          console.log("inside admin condition...")
            // Admin can update any post
            updateCondition = { _id: postId };
        } else if (userRole == "moderator") {
            // Moderator can update their own posts and creators' posts
            updateCondition = { 
                _id: postId,
                $or: [
                    { role: "creator" },
                    { userId: userId }
                ]
            };
        } else if (userRole == "creator") {
            // Creator can only update their own posts
            updateCondition = { 
                _id: postId,
                userId: userId
            };
        }
        console.log("The update condition inside post PUT : ", updateCondition)
        const post = await Post.updateMany(updateCondition, { ...req.body });

        if (post.nModified > 0) {
            res.status(200).send({ message: "Post data updated successfully", post });
        } else {
            res.status(403).send({ message: "You do not have permission to update this post" });
        }


    //if(req.user.role == "admin"){
    //  const post = await Post.updateMany({
    //    _id:postId} ,{...req.body})
    //  res.status(200).send({message:"Post data updated Sucessfully", post})
    //
    //}else if(req.user.role == "moderator"){
    //  const post = await Post.updateMany({
    //    _id:postId,
    //     role:"moderator"
    //
    //  },{...req.body})
    //  res.status(200).send({message:"Post data updated Sucessfully", post})
    //
    //
    //}
    //else{
    //  const post = await Post.updateMany({
    //    where : {
    //      _id:postId,
    //        role:"creator"
    //    }
    //  },{...req.body})
    //  res.status(200).send({message:"Post data updated Sucessfully", post})
    //}
  } catch (error) {
    console.error("Error Updating Post:", error);
    res.status(500).send({ message: "Error Updating Post" });
  }
})

// Delete a post
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
     if(req.user.role == "admin"){
      const post = await Post.deleteMany({
        _id:postId,
         role:"admin"
             
      })
      res.status(200).send({message:"Post data deleted Sucessfully", post})

    }else if(req.user.role == "moderator"){
      const post = await Post.deletedOne({
        _id:postId,
         role:"moderator"
             
      })
      res.status(200).send({message:"Post data deleted Sucessfully", post})

 
    }
    else{
      const post = await Post.deleteOne({
        where : {
          _id:postId,
            role:"creator"
        }
      })
      res.status(200).send({message:"Post data deleted Sucessfully", post})
    }



    // Delete related comments
    await Comment.deleteMany({ postId: postId }); 

  } catch (error) {
    console.error("Error Deleting Post:", error);
    res.status(500).send({ message: "Error Deleting Post" });
  }
})

export default router;
