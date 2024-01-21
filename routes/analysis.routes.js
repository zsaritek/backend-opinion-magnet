const router = require("express").Router();
const Feedback = require("../models/Feedback.model");
const Company = require("../models/Company.model");
const User = require("../models/User.model");

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

  // Display the word frequency results
  console.log('Word Frequency Analysis:', frequency);

}


router.get("/average/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;

        const userData = await User.findById(userId);
        feedbackData = await Feedback.find();
        const filteredData = feedbackData.filter(feedback => {

            return feedback.companyId.equals(userData.company);
        });
        const averageRating = filteredData.length > 0 ? filteredData.reduce((acc, curr) => {
            return acc + curr.rating;
        }, 0)/filteredData.length : 0;
        res.status(200).json({"averageRating": averageRating})
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;