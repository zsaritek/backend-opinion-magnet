// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// Middleware to set CORS headers
app.use((req, res, next) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');

    // Continue to the next middleware or route handler
    next();
});

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const feedbackRoutes = require("./routes/feedback.routes");
app.use("/api", feedbackRoutes);

const analysisRoutes = require("./routes/analysis.routes");
app.use("/api", analysisRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const companyRoutes = require("./routes/company.routes");
app.use("/api", companyRoutes)
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
