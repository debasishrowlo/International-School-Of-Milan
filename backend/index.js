import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from 'url'

import dbConnect from "./src/db/db.js"

import postRoutes from "./src/routes/post.route.js"
import announcementRoutes from "./src/routes/announcements.route.js"
import commentRoutes from './src/routes/comment.route.js'
import userRoutes from "./src/routes/auth.user.route.js"
import casroute from "./src/routes/caspost.route.js"
import casresponseroute from "./src/routes/casResponse.route.js"
import activityRoutes from './src/routes/activity.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

dbConnect()

const app = express()

app.use(express.static(path.resolve(__dirname, "frontend")))

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  })
)
app.use(express.json())
app.use(cookieParser())

app.use("/api/posts", postRoutes)
app.use("/api/announcements", announcementRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/cas", casroute)
app.use("/api/response", casresponseroute)
app.all('/api/*', (_, res) => res.status(404).json({ data: "Not found" }))

app.get('/*', (_, res) => {
  return res.sendFile(path.resolve(__dirname, "frontend/index.html"))
})

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})