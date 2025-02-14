import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
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

ActivitySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const activity  = mongoose.model('Activity', ActivitySchema);

export default activity;
