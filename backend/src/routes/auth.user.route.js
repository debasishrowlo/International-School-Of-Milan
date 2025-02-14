import express from 'express';
const router = express.Router();
import User from '../model/user.model.js';
import generateToken from '../middleware/generateToken.js';
//const bcrypt = require('bcrypt');
//const isAdmin = require('../middleware/isAdmin.js');
import verifyToken from '../middleware/verifyToken.js';
import bulkRegister from '../controller/bulkRegister.js';
import upload from '../middleware/multerMiddleware.js';
import userDataPermission from '../middleware/userDataPermission.js';
//const { verify } = require('jsonwebtoken');

// Register a user

// Bulk Register Using Excel
router.post('/bulkRegister', upload.single('excelFile'), bulkRegister)
// Multi User Route

router.post('/multiRegisterRoute',verifyToken,userDataPermission("admin","moderator"), async (req, res) => {

  console.log("This is users", req.body);
  const password = "ISM2025";

  try {
    const registeredUsers = await Promise.all(
      req.body.map(async (user) => {
        const newUser = new User({
          ...user,
          password
        });
        await newUser.save();
        return newUser;
      })
    );

    res.status(201).json(registeredUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login  a user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User Not Found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid Password.' });
    }

    // Generate token here
    const token = await generateToken(user._id)
    console.log("This is token", token)
    const options = {
      httpOnly: true, // enable this only when u have https
      secure: true,
      sameSite: 'lax'
    }
    res.cookie("token", token, options);
    res.cookie("isLoggedIn", true, options);
    res.status(200).send({
      message: 'User logged in successfully!', token, user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        firstLogin: user.firstLogin,
      }
    });
  } catch (error) {
    console.error("Failed to Login", error);
    res.status(500).json({ message: "Login Failed!" });
  }
})

// Logout  a user
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: 'Logged out successfully!' });
  } catch (error) {
    console.error("Failed to logout.", error);
    res.status(500).send({ message: "Logout Failed!" });
  }
})

// Get  users
router.get('/users',verifyToken, userDataPermission("admin","moderator"), async (req, res) => {
  try {

    if(req.user.role == "admin"){
      const users = await User.find({
         role:{
           $ne:"admin"
         }
             
      })
      res.status(200).send({message:"Users Found Sucessfully", users})

    }else{
      const users = await User.find({
        where : {
            role:{
              $nin :["admin", "moderator"]
            }
        }
      })
      res.status(200).send({message:"Users Found Sucessfully", users})
    }

  } catch (error) {
    console.error("Error Fetching Users.", error);
    res.status(500).send({ message: "Failed to fetch users!" });

  }
})

// Delete a user
router.delete('/users/:id',verifyToken,userDataPermission("admin","moderator"), async (req, res) => {
  try {
    const { id } = req.params;
    if(req.user.role == "admin"){
      const user = await User.deleteOne({
        _id:id,
         role:{
           $ne:"admin"
         }
             
      })
      res.status(200).send({message:"User data deleted Sucessfully", user})

    }else{
      const user = await User.deleteOne({
        where : {
          _id:id,
            role:{
              $nin :["admin", "moderator"]
            }
        }
      })
      res.status(200).send({message:"Users Found Sucessfully", user})
    }
  } catch (error) {
    console.error("Error Deleting User.", error);
    res.status(500).send({ message: "Error Deleting!" });
  }
})

// Update a role for user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ message: "User Role updated successfully!", user });
  } catch (error) {
    console.error("Error Updating The Role.", error);
    res.status(500).send({ message: "Error Updating Role!" });
  }
})
// Reset Password
router.put('/resetPassword', verifyToken, async (req, res) => {
  try {
    const  {newPassword}  = req.body;
    const  id  = req.user.userId;
    console.log("This is new password", newPassword, id)
    const user = await User.findById({
      _id: id,
      firstLogin: true
    })
    if (!user) {
      return res.status(404).send({
        message: "User Not Found Or Password Has Been reset Once already"
      })
    }
    user.password = newPassword
    console.log("this is new pass : ", user)
    user.firstLogin = false;
    await user.save();
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
//Update password

router.put('/users/password/:id',verifyToken,userDataPermission("admin","moderator"), async (req, res) => {
  function hashPassword  (newPassword){
    const hashedPass = bcrypt.hash(newPassword,10)
    return hashedPass;
  } 
    const { id } = req.params;
    const bodyPassword = req.body;
    try{
    if(req.user.role == "admin"){
      const user = await User.updateOne({
        _id:id,
         role:{
           $ne:"admin"
         },
           password:hashPassword(bodyPassword) 
      })
      res.status(200).send({message:"User's password updated Sucessfully", user})
    }else{
      const user = await User.deleteOne({
        where : {
          _id:id,
            role:{
              $nin :["admin", "moderator"]
            },password:hashPassword(bodyPassword)
        }
      })
      res.status(200).send({message:"User's password updated Sucessfully", user})
    }
  } catch (error) {
    console.error("Error chnaging password", error);
    res.status(500).send({ message: "Error changing password" });
  }
})

export default router;
