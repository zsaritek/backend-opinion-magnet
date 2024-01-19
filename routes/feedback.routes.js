const router = require("express").Router();
const Feedback = require("../models/Feedback.model");
const FeedbackAuth = require("../models/FeedbackAuth.model");

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

// router.get("/testimonials/:company", async (req, res, next) => {
//   try {
//   const id = req.params.company;
//   const testimonials = (await Testimonial.find()).filter(item => item.company === id);
//   } catch(err) {
//     console.log(err)
//     next(err)
//   }

// })

// date and company id is also send
router.post("/feedback", async (req, res, next) => {

  try {
  const { rating, feedbackMessage, date } = req.body;
  const access_token = req.headers.access_token;
  
  if (!access_token) {
    return res.status(401).json({ error: 'Access token is missing.' });
  }

  // Check if access token matches with a company_id
  // For testing create FeedbackAuth Document in database: Access Token: access, company_id: 123456
  
  const auths = await FeedbackAuth.find();
  const authDocument = await FeedbackAuth.findOne({ access_token: access_token });
  if(authDocument) {
    const companyID = authDocument.company_id;
    await Feedback.create({rating: rating, feedbackMessage: feedbackMessage, date: date, company_id: companyID})
    res.json("All good in here");
  } else {
    return res.status(401).json({error: "Invalid access token"})
  }  
  } catch(err) {
    console.log(err)
    next(err)
  }
});

module.exports = router;
