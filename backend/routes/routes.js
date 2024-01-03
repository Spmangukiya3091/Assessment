// routes/index.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const employeeController = require("../controllers/employeeController");
const managerController = require("../controllers/managerController");
const { checkManagerRole } = require("../Middleware/authentication");

const validateCreateEmployee = [
  body("name").notEmpty().withMessage("Please fill name"),
  body("email").notEmpty().withMessage("Please fill email").isEmail().withMessage("Invalid email format"),
  body("location").notEmpty().withMessage("Please fill location"),
];

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/user/:id", authController.getUserOrEmployeeById);

// Employee routes
router.get("/employee/:id", employeeController.getSingleEmployee);
router.get("/department", managerController.getAllDepartments);

// Manager routes
router.get("/employees", checkManagerRole, employeeController.getAllEmployees);
// router.get("/department", managerController.getAllDepartments);
router.get("/department/:id", checkManagerRole, managerController.getEmployeesByDepartment);

router.post("/employee", checkManagerRole, validateCreateEmployee, managerController.createEmployee);
router.post("/department", checkManagerRole, managerController.createDepartment);

router.put("/employee/:id", checkManagerRole, managerController.updateEmployee);
router.put("/department/:id", checkManagerRole, managerController.updateDepartment);

router.delete("/employee/:id", checkManagerRole, managerController.deleteEmployee);
router.delete("/department/:id", checkManagerRole, managerController.deleteDepartment);

module.exports = router;
