import mongoose from "mongoose"
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  content: {
    type: Object,
    required: true,
  },
  coverImageUrl: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true
  },
  // published: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

PostSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const Post = mongoose.model('Post', PostSchema);
export default Post;
