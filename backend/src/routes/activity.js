import express from 'express';
const router = express.Router();

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';

import activity from '../model/activity.js';

const supportedActivities = [
  "clubs",
  "cas",
  "competitions",
  "events",
  "tutoring",
]

const activityNotSupported = (slug) => !supportedActivities.includes(slug)

const invalidResponse = (res, message) => {
  return res
    .status(419)
    .send({ message })
}

const createdResponse = (res, activity) => {
  return res.status(201).send(activity)
}

const findActivities = async (activityType) => {
  return await activity.find({ type: activityType })
    .populate({ path: 'author', select: "username" })
    .sort({ createdAt: -1 })
}

const successResponse = (res, activities) => {
  return res.status(200).send(activities)
}

const createActivity = async (activityData) => {
  return await activity.create(activityData)
}

router.get('/:activityType', verifyToken, async (req, res) => {
  try {
    const activityType = req.params.activityType
    console.log({ activityType })

    if (activityNotSupported(activityType)) {
      return invalidResponse(res, "Invalid activity type")
    }

    const activities = await findActivities(activityType)

    return successResponse(res, activities)
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).send({ message: "Error fetching posts" })
  }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const activityType = req.body.type

    if (activityNotSupported(activityType)) {
      return invalidResponse(res, "Invalid activity type")
    }

    const activity = await createActivity({
      type: activityType,
      title: req.body.title,
      coverImageUrl: req.body.coverImageUrl,
      content: req.body.content,
      description: req.body.description,
      author: req.user.id,
    })

    return createdResponse(res, {
      ...activity.toJSON(),
      author: {
        username: req.user.username
      },
    })
  } catch (error) {
    console.error("Error Creating Activity:", error)
    res.status(500).send({ message: "Error Creating Activity" })
  }
})

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const activityId = req.params.id;

    const updatedActivity = await activity
      .findByIdAndUpdate(
        activityId,
        { ...req.body },
        { new: true }
      )
      .populate("author", "username")

    if (!updatedActivity) {
      return res.status(404).send({ message: "Activity Not Found" })
    }

    res.status(200).send({
      ...updatedActivity.toJSON(),
    })
  } catch (error) {
    console.error("Error Updating Activity:", error);
    res.status(500).send({ message: "Error Updating Activity" });
  }
})

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const activityId = req.params.id;

    const activity = await activity.findByIdAndDelete(activityId);
    if (!activity) {
      return res.status(404).send({ message: "Activity Not Found" })
    }

    res.status(200).send({
      message: "Activity Deleted Successfully",
      activity,
    })
  } catch (error) {
    console.error("Error Deleting Activity:", error);
    res.status(500).send({ message: "Error Deleting Activity" });
  }
})

export default router;
