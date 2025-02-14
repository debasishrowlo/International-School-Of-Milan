import mongoose from "mongoose"

const AnnouncementSchema = new mongoose.Schema({
  content: {
    type: Object,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

AnnouncementSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

export default Announcement;
