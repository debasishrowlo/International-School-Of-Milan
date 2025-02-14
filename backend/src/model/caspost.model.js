import mongoose from "mongoose"
//import CasResponse from "./casResponse.model";
const CasPostSchema = new mongoose.Schema({
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
  category: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const CasPost = mongoose.model('CAS', CasPostSchema);

export default CasPost;
