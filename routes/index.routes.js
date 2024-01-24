const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const uploader = require('../middleware/cloudinary.config.js');
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// I need a post request and on the frontend I need have a form with an input of type file and then I submit the form 
router.post("/upload", isAuthenticated, uploader.single('image'), async (req, res) => {
  try {
    console.log(req.body)
      const { _id } = req.payload;
      console.log(_id)
      const imageUrl = req.file.path;
      console.log(imageUrl)
      const user = await User.findOneAndUpdate({_id}, {image: imageUrl}, {new: true})
      if (!user || !user.company) {
          return res.status(404).json({ message: "Not Found" })
      }
      return res.status(200).json(user.image)
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
  }
});

module.exports = router;
