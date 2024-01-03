const { validationResult } = require("express-validator");
const Employee = require("../Models/Employee");
const Department = require("../Models/Department");

module.exports = {
  createEmployee: async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, location, department } = req.body;

      // Check if the employee with the given email and name already exists
      const existingEmployee = await Employee.findOne({ email, name });
      if (existingEmployee) {
        return res.status(400).json({ message: "Employee with the same email and name already exists" });
      }

      // Create a new Employee
      const employee = new Employee({ name, email, location, department });
      const result = await employee.save();

      res.status(201).json({ message: "Employee Added Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, email, location, department } = req.body;

      // Check if the employee exists
      const existingEmployee = await Employee.findById(id);
      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Update the employee details
      existingEmployee.name = name;
      existingEmployee.email = email;
      existingEmployee.location = location;
      existingEmployee.department = department;

      const updatedEmployee = await existingEmployee.save();
      res.json({ message: "Employee Updated Successfully", employee: updatedEmployee });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if the employee exists
      const existingEmployee = await Employee.findById(id);
      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Delete the employee
      await existingEmployee.deleteOne();
      res.json({ message: "Employee Deleted Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  // Departments
  createDepartment: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const existingDepartment = await Department.findOne({ name });

      if (existingDepartment) {
        return res.status(400).json({ message: "Department with the same name already exists" });
      }

      const department = new Department({ name });
      await department.save();

      res.status(201).json({ message: "Department Added Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, manager } = req.body;
      const existingDepartment = await Department.findById(id);

      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }

      existingDepartment.name = name;
      existingDepartment.manager = manager;

      const updatedDepartment = await existingDepartment.save();
      res.json({ message: "Department Updated Successfully", department: updatedDepartment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      const existingDepartment = await Department.findById(id);

      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }

      await existingDepartment.deleteOne();
      res.json({ message: "Department Deleted Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getAllDepartments: async (req, res) => {
    try {
      const departments = await Department.find();
      res.status(200).json({
        message: "Departments",
        departments: departments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getEmployeesByDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params;

      // Find department details
      const department = await Department.findById(departmentId);

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Find employees with the given departmentId
      const employees = await Employee.find({ department: departmentId });

      res.status(200).json({
        message: "Employees by Department",
        department: department,
        employees: employees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
