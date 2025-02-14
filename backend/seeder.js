import mongoose from 'mongoose';
require('dotenv').config()

import User from './src/model/user.model.js'
import Post from './src/model/post.model.js'

const deleteUsers = async () => {
  await User.deleteMany({})
}

const createAdminUser = async () => {
  const name = "User"
  const surname = "Test"
  const grade = "Admin"
  const username = `${name}${surname}${grade}`;
  const password = "1234"

  const user = new User({ username, password, role: "admin" })
  await user.save()

  return user
}

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URL)

  await deleteUsers()

  const user = await createAdminUser()

  console.log("Database Seeded")
}

const main = async () => {
  await seed()
  process.exit(0)
}

main()
