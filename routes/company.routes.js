const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Feedback = require("../models/Feedback.model");
const Company = require("../models/Company.model");
const User = require("../models/User.model");

router.get("/company", isAuthenticated, async (req, res) => {
    try {
        const { _id } = req.payload;
        const user = await User.findOne({ _id }).populate('company');
        if (!user || !user.company) {
            return res.status(404).json({ message: "Not Found" })
        }
        return res.status(200).json(user.company)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
});


module.exports = router;