import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'moderator', 'creator'],
    default: 'student',
    required: true

  },
  firstLogin: {
    type: Boolean,
    default: true
  },
  appliedPost: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'CasPost',
  },
  club: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Club',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

// Hash a password before saving to db
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
})

// compare password when user logins
UserSchema.methods.comparePassword = function(givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
}

const User = model('User', UserSchema);
export default User;
