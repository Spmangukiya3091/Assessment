const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

const Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;
