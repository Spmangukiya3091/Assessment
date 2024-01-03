const { validationResult } = require("express-validator");
const Employee = require("../Models/Employee");

module.exports = {
  getAllEmployees: async (req, res) => {
    const { page = 1, limit = 10, sort } = req.query;

    // Validate page and limit parameters
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedPage) || isNaN(parsedLimit) || parsedPage < 1 || parsedLimit < 1) {
      return res.status(400).json({ error: "Invalid page or limit parameters" });
    }

    // Calculate skip value based on page and limit
    const skip = (parsedPage - 1) * parsedLimit;

    // Define the sort order object based on the sort parameter
    const sortObject = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortObject[field] = order.toLowerCase() === "desc" ? -1 : 1;
    } else {
      // Default sort order if not provided in the query
      sortObject.name = 1;
    }

    const sortField = sortObject.department ? "department" : "name"; // Use 'name' as default if department is not specified

    try {
      const employees = await Employee.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            location: 1,
            department: 1,
            sortField: { $substr: ["$name", 0, 1] }, // Extract the first letter of the name
          },
        },
        {
          $sort: {
            [sortField]: sortObject[sortField] || 1, // Use 1 as the default value if sortObject[sortField] is not defined
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: parsedLimit,
        },
        {
          $lookup: {
            from: "departments", // Adjust the collection name if necessary
            localField: "department",
            foreignField: "_id",
            as: "departmentDetails",
          },
        },
        {
          $unwind: "$departmentDetails",
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            location: 1,
            department: "$departmentDetails.name", // Replace "department" with the correct field in the departments collection
          },
        },
      ]);

      // Get the total count of documents in the collection
      const totalEmployees = await Employee.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalEmployees / parsedLimit);

      res.status(200).json({
        message: "Employees",
        currentPage: parsedPage,
        totalPages,
        employees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getSingleEmployee: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);

      res.status(200).json({
        message: employee ? "Single Employee" : "No Employee found",
        employee,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  filterEmployeesByLocation: async (req, res) => {
    try {
      const employees = await Employee.find().sort({ location: 1, name: 1 });

      res.status(200).json({ employees });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  filterEmployeesByName: async (req, res) => {
    try {
      const { sort } = req.query;
      const sortOrder = sort && sort.toLowerCase() === "desc" ? -1 : 1;

      const employees = await Employee.find().sort({ name: sortOrder });

      res.status(200).json({ employees });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
