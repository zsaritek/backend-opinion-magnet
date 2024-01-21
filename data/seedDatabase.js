const Feedback = require("../models/Feedback.model");
const Company = require("../models/Company.model");
const feedbackData = require("./feedbackData.json");
const companyData = require("./companyData.json");



const seedDatabase = async () => {
    const testCompany = await Company.create(companyData);

    comp_id = testCompany._id;

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