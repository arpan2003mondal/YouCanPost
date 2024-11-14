const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    try {
        let token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
        return token;
    } catch (error) {
        console.error("Error generating token:", error.message);
    }
};

module.exports.generateToken = generateToken;
