const router = require("express").Router();
const Testimonial = require("../models/Testimonial.model");

router.post("/review", async (req, res, next) => {

  try {
  const { rating, feedbackMessage } = req.body;

  await Testimonial.create({rating: rating, feedbackMessage: feedbackMessage})

  res.json("All good in here");
  } catch(err) {
    console.log(err)
  }
});

module.exports = router;
