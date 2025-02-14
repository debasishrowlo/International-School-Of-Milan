import express from 'express';
const router = express.Router();
import CasResponse from '../model/casResponse.model.js';
import User from '../model/user.model.js';
import verifyToken from '../middleware/verifyToken.js';
//import isAdmin from ('../middleware/isAdmin.js');


// Create A Response
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newCasResponse = new CasResponse({ ...req.body, author: req.userId });
    await newCasResponse.save();

    //console.log(user)

    res.status(200).send({
      message: "Response Created Successfully",
      post: newCasResponse,
    })
  }
  catch (error) {
    console.error("Error Creating Cas:", error);
    res.status(500).send({ message: "Error Creating Cas" })
  }

})
// Get all response from one CAS
router.get('/fromCas/:id', async (req, res) => {
  try {
    const casId = req.params.id;
    let query = { ...query, casId: casId }

    const cas = await CasResponse.find(query).populate('author', 'email').sort({ createdAt: -1 });
    res.status(200).send(cas);

  } catch (error) {
    console.error("Error finding all response for one CAS:", error);
    res.status(500).send({ message: "Error finding all response for one CAS:" })
  }
});

// Delete a Response
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const responseId = req.params.id;
    const response = await CasResponse.findByIdAndDelete(responseId);
    if (!response) {
      return res.status(404).send({ message: "response Not Found" })
    }

    res.status(200).send({
      message: "response Deleted Successfully",
      post: response
    })

  } catch (error) {
    console.error("Error Deleting response:", error);
    res.status(500).send({ message: "Error Deleting resoponse" });
  }
})




export default router;
