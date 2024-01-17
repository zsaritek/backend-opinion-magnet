const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const testimonialSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required.']
    },
    feedbackMessage: {
      type: String,
      required: [true, 'Review is required.']
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Testimonial = model("Testimonial", testimonialSchema);

module.exports = Testimonial;
