const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const feedbackAuthSchema = new Schema(
  {
    access_token: {
      type: String,
      required: [true, 'Access token is required.']
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

const FeedbackAuth = model("FeedbackAuth", feedbackAuthSchema);

module.exports = FeedbackAuth;
