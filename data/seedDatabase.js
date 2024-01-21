const Feedback = require("../models/Feedback.model");
const Company = require("../models/Company.model");
const feedbackData = require("./feedbackData.json");




const seedDatabase = async (comp_id) => {

    const feedbackEntries = feedbackData.map(entry => {
        return ({
            rating: entry.rating,
            feedback: entry.feedback,
            companyId: comp_id
        })
    })
    

    await Feedback.insertMany(feedbackEntries);
}

module.exports = seedDatabase;