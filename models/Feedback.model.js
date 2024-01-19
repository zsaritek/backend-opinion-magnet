const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const feedbackSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required.']
    },
    feedbackMessage: {
      type: String,
      required: [true, 'Review is required.']
    },
    date:{
      type: Date
    },
    company_id: {
      type: Number 
    }

    }
  ,
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Feedback = model("Feedback", feedbackSchema);

module.exports = Feedback;
