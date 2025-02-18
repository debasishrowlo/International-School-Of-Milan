// Importing libraries
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./src/db/db.js";
dotenv.config()
import cookieParser from "cookie-parser";

import postRoutes from "./src/routes/post.route.js";
import announcementRoutes from "./src/routes/announcements.route.js"
import commentRoutes from './src/routes/comment.route.js';
import userRoutes from "./src/routes/auth.user.route.js";
import casroute from "./src/routes/caspost.route.js"
import casresponseroute from "./src/routes/casResponse.route.js"
import activityRoutes from './src/routes/activity.js'

const app = express();
dbConnect()
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://international-school-of-milan-7ex8.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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
