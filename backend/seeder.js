import mongoose from 'mongoose';
import "dotenv/config"

import User from './src/model/user.model.js'
import Post from './src/model/post.model.js'

const deleteUsers = async () => {
  await User.deleteMany({})
}

const createAdminUser = async () => {
  const firstName = "User"
  const lastName = "Test"
  const grade = "Admin"
  const password = "1234"

  const user = new User({ firstName, lastName, grade, password, role: "admin" })
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
