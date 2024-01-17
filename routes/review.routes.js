const router = require("express").Router();
const Testimonial = require("../models/Testimonial.model");


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

router.get("/word-frequency", (req, res) => {
    const textToAnalyze = "This is an example sentence. This sentence is just for demonstration purposes.";
    //console.log(stopWords)
    analyzeWordFrequency(textToAnalyze);
    res.status(200).json({message: "Frequency analysis is done"});
})

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
