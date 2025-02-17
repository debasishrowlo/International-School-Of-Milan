// Importing libraries
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./db/db.js";
dotenv.config()
import cookieParser from "cookie-parser";

import postRoutes from "./routes/post.route.js";
import announcementRoutes from "./routes/announcements.route.js"
import commentRoutes from './routes/comment.route.js';
import userRoutes from "./routes/auth.user.route.js";
import casroute from "./routes/caspost.route.js"
import casresponseroute from "./routes/casResponse.route.js"
import activityRoutes from './routes/activity.js'

const app = express();
dbConnect()
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://international-school-of-milan.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,

  })
);

app.use(cookieParser())

const PORT = process.env.PORT || 3000;
app.use("/api/posts", postRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/cas", casroute);
app.use("/api/response", casresponseroute);

app.get('/', (req, res) => {
  res.send('Hello Worldd!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
