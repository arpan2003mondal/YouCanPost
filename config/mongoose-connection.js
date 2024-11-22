const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose"); 
const config = require("config");

mongoose
    .connect(config.get("MONGODB_URI"), { dbName: "PostCreation" }) // Specify the database name
    .then(() => dbgr("MongoDB connected"))
    .catch((err) => dbgr("MongoDB connection error:", err));

module.exports = mongoose.connection;



