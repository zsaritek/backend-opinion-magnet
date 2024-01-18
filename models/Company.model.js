const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    token: {
      type: String,
      required: [true, 'Token is required.']
    }
    }
  ,
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Company = model("Company", companySchema);

module.exports = Company;
