const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose"); 
const config = require("config");

const uri = config.has("MONGODB_URI") ? config.get("MONGODB_URI") : process.env.MONGODB_URI;

mongoose
    .connect(uri, { dbName: "PostCreation" }) // Specify the database name
    .then(() => dbgr("MongoDB connected"))
    .catch((err) => dbgr("MongoDB connection error:", err));

module.exports = mongoose.connection;



