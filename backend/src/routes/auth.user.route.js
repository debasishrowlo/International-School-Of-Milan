import express from 'express';

import generateToken from '../middleware/generateToken.js';
import verifyToken from '../middleware/verifyToken.js';
import userDataPermission from '../middleware/userDataPermission.js';
import bulkRegister from '../controller/bulkRegister.js';
import upload from '../middleware/multerMiddleware.js';

import User from '../model/user.model.js';

const router = express.Router();

const daysToMs = (days) => {
  const millisecondsPerSecond = 1000
  const secondsPerMinute = 60
  const minutesPerHour = 60
  const hoursPerDay = 24
  return days * hoursPerDay * minutesPerHour * secondsPerMinute * millisecondsPerSecond
}

router.post('/bulkRegister', upload.single('excelFile'), bulkRegister)

// Multi User Route
router.post('/multiRegisterRoute', verifyToken, userDataPermission("admin", "moderator"), async (req, res) => {
  const password = "ISM2025"

  try {
    await Promise.all(
      req.body.map(async user => {
        const newUser = new User({
          firstName: user.firstName,
          lastName: user.lastName,
          grade: user.grade,
          role: user.role,
          password,
        });
        await newUser.save();
        return newUser;
      })
    )

    res.status(201).send()
  } catch (error) {
    // TODO: Handle duplicate username case separately
    res.status(400).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User Not Found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid Password.' });
    }

    const cookieOptions = {
      expires: new Date(Date.now() + daysToMs(1)),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }

    const token = await generateToken(user._id)
    res.cookie('token', token, { ...cookieOptions })

    res.cookie("isLoggedIn", true, {
      ...cookieOptions,
      httpOnly: false,
    })

    res
      .status(200)
      .send({
        message: 'User logged in successfully!',
        user: {
          role: user.role,
          username: user.username,
        },
      })
  } catch (error) {
    console.error("Failed to Login", error);
    res.status(500).json({ message: "Login Failed!" });
  }
})

router.post('/logout', async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: 'Logged out successfully!' });
  } catch (error) {
    console.error("Failed to logout.", error);
    res.status(500).send({ message: "Logout Failed!" });
  }
})

router.get('/users', verifyToken, userDataPermission(["admin", "moderator"]), async (req, res) => {
  try {
    const fields = "firstName lastName grade role"
    if (req.user.role == "admin") {
      const users = await User.find({
        role: {
          $ne: "admin"
        },
      }).select(fields)
      res.status(200).send({ message: "Users Found Sucessfully", users })
    } else {
      const users = await User.find({
        where: {
          role: {
            $nin: ["admin", "moderator"]
          }
        }
      }).select(fields)
      res.status(200).send({ message: "Users Found Sucessfully", users })
    }
  } catch (error) {
    console.error("Error Fetching Users.", error);
    res.status(500).send({ message: "Failed to fetch users!" });
  }
})

router.delete('/users/:id', verifyToken, userDataPermission(["admin", "moderator"]), async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)

  if (!user) {
    return res.status(404).send()
  }

  if (user.role === "admin") {
    return res.status(403).send()
  }

  await user.deleteOne()

  res.status(200).send({ message: "User data deleted Sucessfully" })
})

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user: userData } = req.body

    const user = await User.findByIdAndUpdate(id, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      grade: userData.grade,
      role: userData.role,
    }, { new: true });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    return res.status(200).send({ message: "User updated successfully!" });
  } catch (error) {
    console.error("Error Updating The Role.", error);
    res.status(500).send({ message: "Error Updating!" });
  }
})

router.put('/reset-password', verifyToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findById({
      _id: req.user.id,
    })

    if (!user) {
      return res.status(404).send({
        message: "User Not Found Or Password Has Been reset Once already"
      })
    }

    user.password = newPassword

    await user.save()
    return res.status(200).json({
      message: "Password Reset Successfully",
      success: true
    })
  } catch (error) {
    console.error("Error Resetting Password", error);
    res.status(500).send({
      message: "Error Resetting Password"
    })
  }
})

router.put('/users/password/:id', verifyToken, userDataPermission("admin", "moderator"), async (req, res) => {
  function hashPassword(newPassword) {
    const hashedPass = bcrypt.hash(newPassword, 10)
    return hashedPass;
  }
  const { id } = req.params;
  const bodyPassword = req.body;
  try {
    if (req.user.role == "admin") {
      const user = await User.updateOne({
        _id: id,
        role: {
          $ne: "admin"
        },
        password: hashPassword(bodyPassword)
      })
      res.status(200).send({ message: "User's password updated Sucessfully", user })
    } else {
      const user = await User.deleteOne({
        where: {
          _id: id,
          role: {
            $nin: ["admin", "moderator"]
          }, password: hashPassword(bodyPassword)
        }
      })
      res.status(200).send({ message: "User's password updated Sucessfully", user })
    }
  } catch (error) {
    console.error("Error chnaging password", error);
    res.status(500).send({ message: "Error changing password" });
  }
})

export default router;