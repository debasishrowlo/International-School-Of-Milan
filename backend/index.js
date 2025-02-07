// Importing libraries
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")

const port = process.env.PORT || 3000;

// parse options
app.use(express.json());
app.use(cors({
  origin: [
    "*",
    //'https://school-web-test-front.onrender.com',
    //'http://localhost:5173',
    //"https://final-final-test-my.vercel.app"
  ],
  credentials: true,
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
const postRoutes = require("./src/routes/post.route");
const announcementRoutes = require("./src/routes/announcements.route")
const commentRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");
const casroute = require("./src/routes/caspost.route")
const casresponseroute = require("./src/routes/casResponse.route")
const activityRoutes = require("./src/routes/activity")

app.use("/api/posts", postRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/cas", casroute);
app.use("/api/response", casresponseroute);

async function main() {
  await mongoose.connect(process.env.MONGODB_URL)
}

main()
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello Worldd!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
