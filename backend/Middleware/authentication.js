// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

exports.checkManagerRole = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split("authToken=")[1];
    const decodedToken = jwt.verify(token, "empl0yee-m@n@gement");

    const user = await User.findById(decodedToken.userId);

    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden: Only managers can perform this action" });
    }

    // If the user is a manager, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
