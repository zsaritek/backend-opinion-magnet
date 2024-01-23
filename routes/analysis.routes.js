const router = require("express").Router();
const Feedback = require("../models/Feedback.model");
const Company = require("../models/Company.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopwords = require('natural').stopwords;

const stopWords = stopwords;

function analyzeWordFrequency(text) {
  const words = tokenizer.tokenize(text);

  const frequency = {};

  words.forEach(word => {
    const lowercaseWord = word.toLowerCase(); // Convert to lowercase for case-insensitive comparison
    if (!stopWords.includes(lowercaseWord)) {
      if (frequency[lowercaseWord]) {
        frequency[lowercaseWord]++;
      } else {
        frequency[lowercaseWord] = 1;
      }
    }
  });

  return frequency

}


router.get("/average", isAuthenticated, async (req, res, next) => {
    try {
        const { _id } = req.payload;
        const userData = await User.findOne({ _id })
        feedbackData = await Feedback.find();
        const filteredData = feedbackData.filter(feedback => {

            return feedback.company.equals(userData.company);
        });
        const averageRating = filteredData.length > 0 ? filteredData.reduce((acc, curr) => {
            return acc + curr.rating;
        }, 0)/filteredData.length : 0;
        res.status(200).json({"averageRating": averageRating})
    } catch (error) {
        console.log(error)
    }

});

router.get("/keywords", isAuthenticated, async (req, res, next) => {
  try {
      const { _id } = req.payload;
      const userData = await User.findOne({ _id })
      feedbackData = await Feedback.find();
      const filteredData = feedbackData.filter(feedback => {

          return feedback.company.equals(userData.company);
      });
      let text = "";
      filteredData.forEach(data => {
        text+= data.feedback;
      });
      const words = analyzeWordFrequency(text);
      const myArray = Object.entries(words);
      console.log("entries", myArray)
      myArray.sort((a, b) => b[1] - a[1]);
      const popularWords = Object.fromEntries(myArray);

      console.log(popularWords);
      res.status(200).json({"popularWords": popularWords})
  } catch (error) {
      console.log(error)
  }

});

module.exports = router;