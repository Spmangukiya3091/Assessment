const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, "empl0yee-m@n@gement", { expiresIn: "1d" });
};

const signupValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = {
  signup: async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, email } = req.body;

      // Assuming 'manager' as the default role for signup
      const role = "manager";

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new User with the 'manager' role
      const user = await User.create({ username, password: hashedPassword, role, email });

      const token = generateToken(user._id);

      res.json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = generateToken(user._id, user.role);

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserOrEmployeeById: async (req, res) => {
    try {
      const id = req.params.id;
      // Check if the ID matches a User
      const user = await User.findById(id);
      if (user) {
        return { type: "user", details: user };
      }

      // Check if the ID matches an Employee
      const employee = await Employee.findById(id);
      if (employee) {
        return { type: "employee", details: employee };
      }

      // Return null if no match is found
      return null;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  },
};
