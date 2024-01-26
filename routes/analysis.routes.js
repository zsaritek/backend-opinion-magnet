const router = require("express").Router();
const Feedback = require("../models/Feedback.model");
const Company = require("../models/Company.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { kmeans } = require('ml-kmeans');
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
        res.status(200).json({"averageRating": (averageRating.toFixed(2))})
    } catch (error) {
        console.log(error)
    }

});

router.get("/ratings", isAuthenticated, async (req, res, next) => {
  try {
      const { _id } = req.payload;
      const userData = await User.findOne({ _id })
      feedbackData = await Feedback.find();
      const filteredData = feedbackData.filter(feedback => {

          return feedback.company.equals(userData.company);
      });

      

      // prepare data for histogramm

      // Extract ratings from feedback data
      const allRatings = filteredData.map((feedback) => feedback.rating);

      // Count occurrences of each rating
      const ratingCounts = allRatings.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      // Transform counts into format suitable for the histogram chart
      const histogramChartData = Object.entries(ratingCounts).map(([rating, count]) => ({
        name: `Rating ${rating}`,
        data: count,
      }));
      console.log(histogramChartData)

      // prepare data for timeline

      const data = filteredData.map(element => {
        return (
          {[new Date(element.createdAt)]: element.rating}
        )
      })
      const dataObject = filteredData.reduce((acc, obj) => {
        // Extract the date and value from each object
        const { createdAt, rating } = obj;
        
        // Add the date and value to the accumulator object
        acc[createdAt] = rating;
      
        // Return the updated accumulator for the next iteration
        return acc;
      }, {});
      //console.log(dataObject)

      //console.log(data)
      res.status(200).json({"ratings": dataObject, "histogram": {histogramChartData}})
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
      //console.log("entries", myArray)
      myArray.sort((a, b) => b[1] - a[1]);
      const popularWords = Object.fromEntries(myArray.slice(0,10));

      //console.log(popularWords);
      res.status(200).json({"popularWords": popularWords})
  } catch (error) {
      console.log(error)
  }

});

router.get("/clustering", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const userData = await User.findOne({ _id });
    const feedbackData = await Feedback.find({ company: userData.company });

    const preprocessText = (text) => {
      const tokens = tokenizer.tokenize(text);
      return tokens;
    };
    // Create a 2D array to store the TF-IDF matrix
    const tfidfDataMatrix = [];

    // Create a set to collect unique terms across all documents
    const termsSet = new Set();

    // Add documents to the TF-IDF model
    const tfidf = new natural.TfIdf();
    const filteredData = feedbackData.filter(feedback => {

        return feedback.company.equals(userData.company);
    });
    filteredData.forEach((feedback, index) => {
      const preprocessedText = preprocessText(feedback.feedback);
      tfidf.addDocument(preprocessedText.join(' '), { id: index }); // Include document index as an identifier
      
      // Collect unique terms for each document
      preprocessedText.forEach((term) => {
        termsSet.add(term);
      });
    });

    // Convert the set of terms to an array
    const termsArray = Array.from(termsSet);

    // Iterate over all documents
    tfidf.documents.forEach((document, documentIndex) => {
      // Create an array to store TF-IDF values for the current document
      const tfidfValues = new Array(termsArray.length).fill(0);

      // Get TF-IDF terms for the current document
      tfidf.listTerms(documentIndex).forEach((item) => {
        const termIndex = termsArray.indexOf(item.term);
        tfidfValues[termIndex] = item.tfidf;
      });

      // Add the TF-IDF values to the matrix
      tfidfDataMatrix.push(tfidfValues);
    });

    //console.log(tfidfDataMatrix);

    // // Now, tfidfDataMatrix is ready for k-means clustering
    // //console.log(tfidfDataMatrix)
    const data = tfidfDataMatrix.map((item) => item.tfidf);
    //console.log(data)
    // Assuming you want 3 clusters (you can adjust this)
    const ans = kmeans(tfidfDataMatrix, 3);

    // // Get the cluster assignments for each document
    

    // // Log the cluster assignments
    console.log(ans.clusters);
    const myClusters = ans.clusters;
    let cl1 = [];
    let cl2 = [];
    let cl3 = [];
    filteredData.forEach((feed, index) => {
      if(myClusters[index] === 0) {
        cl1.push(feed)
      } else if(myClusters[index] === 1) {
        cl2.push(feed)
      } else if (myClusters[index] === 2) {
        cl3.push(feed)
      }
    })

    
  res.status(200).json({"clusters": [cl1, cl2, cl3]})
  } catch (error) {
    console.log(error);
  }
});



router.get("/test-ratings", async (req, res, next) => {
  try {
      
      feedbackData = await Feedback.find();
     
      // prepare data for histogramm

      // Extract ratings from feedback data
      const allRatings = feedbackData.map((feedback) => feedback.rating);

      // Count occurrences of each rating
      const ratingCounts = allRatings.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      // Transform counts into format suitable for the histogram chart
      const histogramChartData = Object.entries(ratingCounts).map(([rating, count]) => ({
        label: `${rating} stars`,
        value: count,
      }));
      console.log(histogramChartData)
      res.status(200).json({"ratings": histogramChartData})
    } catch(err) {
      console.log(err)
    }
  })

module.exports = router;