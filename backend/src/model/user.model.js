import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { generateUsername } from "../common.js"

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  grade: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true,
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

UserSchema.set("toObject", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

UserSchema.pre('validate', async function(next) {
  const user = this;

  if (!user.username) {
    user.username = generateUsername(user.firstName, user.lastName, user.grade)
  }

  next();
})

UserSchema.pre('save', async function(next) {
  const user = this;

  if (user.isNew) {
    user.password = await hashPassword(user.password)
  } else {
    if (user.isModified('password')) {
      user.password = await hashPassword(user.password)
    }

    if (
      user.isModified('firstName') ||
      user.isModified('lastName') ||
      user.isModified('grade')
    ) {
      user.username = generateUsername(user.firstName, user.lastName, user.grade)
    }
  }

  next();
})

// compare password when user logins
UserSchema.methods.comparePassword = function(givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
}

const User = model('User', UserSchema);
export default User;