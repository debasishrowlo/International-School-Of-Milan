import express from 'express';
const router = express.Router();
import CasPost from '../model/caspost.model.js';
import CASResponse from '../model/casResponse.model.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from "../middleware/isAdmin.js";

// Create A CAS
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    console.log("Post Data From API:", req.body)
    console.log("User Data From API:", req.user)
    const newCasPost = new CasPost({ ...req.body, author: req.user._id, username: req.user.username }); // use author: req.userId after making verify token
    await newCasPost.save();
    res.status(201).send({
      message: "Cas Created Successfully",
      post: newCasPost
    })
  }

  catch (error) {
    console.error("Error Creating Cas:", error);
    res.status(500).send({ message: "Error Creating Cas" })
  }

})
// Get all CAS
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    console.log(search);

    let query = {}

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      }
    }

    if (category) {
      query = {
        ...query,
        category: category
      }
    }



    const cas = await CasPost.find(query).populate('author', 'email').sort({ createdAt: -1 });
    res.status(200).send(cas);

  } catch (error) {
    console.error("Error Finding CAS:", error);
    res.status(500).send({ message: "Error Finding Cas" })
  }
});

// Get CAS by ID
router.get('/:id', async (req, res) => {
  try {
    // console.log(req.params.id);
    const casId = req.params.id;
    console.log(casId);
    const cas = await CasPost.findById(casId);
    if (!cas) {
      return res.status(404).send({ message: "Cas Not Found" })
    }

    const casresponse = await CASResponse.find({ casId: casId }).populate('user', "username email");
    res.status(200).send({
      message: "CAS Retrieved Successfully",
      post: cas,
      response: casresponse,
    })
  } catch (error) {
    console.error("Error Fetching Single CAS:", error);
    res.status(500).send({ message: "Error Fetching Single Cas" });
  }
})


// Update a post
router.patch("/update/:id", verifyToken, async (req, res) => {

  try {
    const casId = req.params.id;
    const updatedCAS = await CasPost.findByIdAndUpdate(casId, {
      ...req.body
    }, { new: true });
    if (!updatedCAS) {
      return res.status(404).send({ message: "CAS Not Found" })
    }
    res.status(200).send({
      message: "CAS Updated Successfully",
      post: updatedCAS
    })

  } catch (error) {
    console.error("Error Updating CAS:", error);
    res.status(500).send({ message: "Error Updating CAS" });
  }
})

// Delete a CAS
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const casId = req.params.id;
    const cas = await CasPost.findByIdAndDelete(casId);
    if (!cas) {
      return res.status(404).send({ message: "CAS Not Found" })
    }

    // Delete related comments
    await CASResponse.deleteMany({ casId: casId }); //TOCHANGE DELETE RESPONSES

    res.status(200).send({
      message: "CAS Deleted Successfully",
      post: cas
    })

  } catch (error) {
    console.error("Error Deleting CAS:", error);
    res.status(500).send({ message: "Error Deleting CAS" });
  }
})



export default router;

