import mongoose from "mongoose"

import Post from "./post.model.js"

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

CommentSchema.post("save", async function (doc, next) {
  await Post.findByIdAndUpdate(doc.post, { $push: { comments: doc._id } })
  next()
})

CommentSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment
